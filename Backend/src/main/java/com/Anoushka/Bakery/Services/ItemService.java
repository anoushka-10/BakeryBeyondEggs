package com.Anoushka.Bakery.Services;


import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.Anoushka.Bakery.DTO.ItemDTO;
import com.Anoushka.Bakery.DTO.WeightPriceDTO;
import com.Anoushka.Bakery.Models.Category;
import com.Anoushka.Bakery.Models.Item;
import com.Anoushka.Bakery.Models.Subcategory;
import com.Anoushka.Bakery.Models.WeightPrice;
import com.Anoushka.Bakery.Repositories.CategoryRepository;
import com.Anoushka.Bakery.Repositories.ItemRepository;
import com.Anoushka.Bakery.Repositories.SubcategoryRepository;

import io.jsonwebtoken.io.IOException;
import jakarta.transaction.Transactional;

@Service
public class ItemService {
    
    @Autowired
    private ItemRepository itemRepository;

    @Value("${backend.images.dir}")
    private String backendImagesDir;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private SubcategoryRepository subcategoryrepo;

    @Transactional
    @Cacheable(value = "itemsByCategory", key = "#categoryName")
    public List<ItemDTO> getItemsByCategoryName(String categoryName) {
        Category category = categoryRepository.findByName(categoryName);
        List<ItemDTO> dtoList = new ArrayList<>();

        if (category != null) {
            for (Subcategory subcategory : category.getSubcategories()) {
                for (Item item : subcategory.getItems()) {
                    item.getWeightPrices().size(); // Force fetch if lazy

                    List<WeightPriceDTO> prices = item.getWeightPrices().stream()
                        .map(wp -> new WeightPriceDTO(wp.getId(), wp.getWeight(), wp.getPrice()))
                        .collect(Collectors.toList());
                 
                    dtoList.add(new ItemDTO(
                        item.getId(),
                        item.getName(),
                        item.getDescription(),
                        item.getImagepath(),
                        subcategory.getId(),
                        prices
                    ));
                }
            }
        }

        return dtoList;
    }

    
    
    @Transactional
    @Cacheable(value = "itemsBySubcategory", key = "#subcategoryName")
    public List<ItemDTO> getItemsBySubcategory(String subcategoryName) {
        Subcategory subcategory = subcategoryrepo.findByName(subcategoryName);
        List<Item> items = itemRepository.findBySubcategory(subcategory);

        return items.stream().map(item -> {
            item.getWeightPrices().size();
            List<WeightPriceDTO> weightPrices = item.getWeightPrices()
                .stream()
                .map(wp -> new WeightPriceDTO(wp.getId(), wp.getWeight(), wp.getPrice()))
                .collect(Collectors.toList());

            return new ItemDTO(item.getId(), item.getName(),item.getDescription(), item.getImagepath(),item.getSubcategory().getId(), weightPrices );
        }).collect(Collectors.toList());
    }



    public Item addItem(ItemDTO itemRequest, MultipartFile image) throws IOException, java.io.IOException {
        // Validate image
        if (image == null || image.isEmpty()) {
            throw new IllegalArgumentException("Image file is required");
        }

        // Create filename
        String filename = itemRequest.getName().toLowerCase().replaceAll("\\s+", "") +
                          getFileExtension(image.getOriginalFilename());

        // Create upload directory if not exists
        File uploadDir = new File(backendImagesDir);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        // Save the image
        Path filePath = Paths.get(backendImagesDir, filename);
        Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);


        // Build and save item
        Item item = new Item();
        item.setName(itemRequest.getName());
        item.setDescription(itemRequest.getDescription());
     // Replace the entire subcategory block with this:
        Subcategory subcategory = subcategoryrepo.findById(itemRequest.getSubcategoryid())
            .orElseThrow(() -> new IllegalArgumentException("Subcategory with ID " + itemRequest.getSubcategoryid() + " not found"));
        item.setSubcategory(subcategory);
        item.setImagepath("/images/" + filename); // So frontend can access it later

        List<WeightPrice> wtprlist = new ArrayList<>();
        for (WeightPriceDTO wtp : itemRequest.getWeightPrices()) {
            WeightPrice wtprice = new WeightPrice();
            wtprice.setItem(item);
            wtprice.setWeight(wtp.getWeight());
            wtprice.setPrice(wtp.getPrice());
            wtprlist.add(wtprice);
        }
        item.setWeightPrices(wtprlist);

        return itemRepository.save(item);
    }

    private String getFileExtension(String filename) {
        return filename != null && filename.contains(".")
            ? filename.substring(filename.lastIndexOf("."))
            : ".jpg";
    }

    @Transactional
    public Item editItem( ItemDTO itemRequest, MultipartFile image) throws IOException, java.io.IOException {
        // Find existing item
        Item existingItem = itemRepository.findById(itemRequest.getId())
            .orElseThrow(() -> new IllegalArgumentException("Item with ID " + itemRequest.getId()+ " not found"));
        
        // Update basic fields
        existingItem.setName(itemRequest.getName());
        existingItem.setDescription(itemRequest.getDescription());
        
        // Update subcategory if provided
        if (itemRequest.getSubcategoryid() != null) {
            Subcategory subcategory = subcategoryrepo.findById(itemRequest.getSubcategoryid())
                .orElseThrow(() -> new IllegalArgumentException("Subcategory with ID " + itemRequest.getSubcategoryid() + " not found"));
            existingItem.setSubcategory(subcategory);
        }
        
        // Handle image update (only if new image is provided)
        if (image != null && !image.isEmpty()) {
            // Delete old image file if it exists
            String oldImagePath = existingItem.getImagepath();
            if (oldImagePath != null && !oldImagePath.isEmpty()) {
                String oldFilename = oldImagePath.substring(oldImagePath.lastIndexOf("/") + 1);
                Path oldFilePath = Paths.get(backendImagesDir, oldFilename);
                try {
                    Files.deleteIfExists(oldFilePath);
                } catch (Exception e) {
                    // Log but don't fail the update if old image deletion fails
                    System.err.println("Could not delete old image: " + e.getMessage());
                }
            }
            
            // Save new image
            String filename = itemRequest.getName().toLowerCase().replaceAll("\\s+", "") +
                              getFileExtension(image.getOriginalFilename());
            
            // Create upload directory if not exists
            File uploadDir = new File(backendImagesDir);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }
            
            Path filePath = Paths.get(backendImagesDir, filename);
            Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            existingItem.setImagepath("/images/" + filename);
        }
        
        // Update weight prices if provided
        if (itemRequest.getWeightPrices() != null && !itemRequest.getWeightPrices().isEmpty()) {
            // Clear existing weight prices
            existingItem.getWeightPrices().clear();
            
            // Add new weight prices
            List<WeightPrice> wtprlist = new ArrayList<>();
            for (WeightPriceDTO wtp : itemRequest.getWeightPrices()) {
                WeightPrice wtprice = new WeightPrice();
                wtprice.setItem(existingItem);
                wtprice.setWeight(wtp.getWeight());
                wtprice.setPrice(wtp.getPrice());
                wtprlist.add(wtprice);
            }
            existingItem.setWeightPrices(wtprlist);
        }
        
        return itemRepository.save(existingItem);
    }
	
}
