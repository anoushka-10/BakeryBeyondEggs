package com.Anoushka.Bakery.Services;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.Anoushka.Bakery.DTO.SubcategoryCreateDTO;
import com.Anoushka.Bakery.Models.Category;
import com.Anoushka.Bakery.Models.Item;
import com.Anoushka.Bakery.Models.Subcategory;
import com.Anoushka.Bakery.Repositories.CategoryRepository;
import com.Anoushka.Bakery.Repositories.ItemRepository;
import com.Anoushka.Bakery.Repositories.SubcategoryRepository;

@Service
public class SubcategoryService {

	
	@Autowired
	private SubcategoryRepository subcategoryrepo;
	
	@Autowired
	private CategoryRepository categoryRepo;
	
	@Value("${backend.images.dir}")
    private String backendImagesDir;
	
	@Autowired
	private ItemRepository itemrepo;
	
	public List<Subcategory> findSubcategoriesByCategoryName(String categoryName) {
		 return subcategoryrepo.findSubcategoryNamesByCategoryName(categoryName);
	}
	
	public List<Item> getItemsBySubcategory(String subcategoryName) {
	    // Find the subcategory by its unique name
	    Subcategory subcategory = subcategoryrepo.findByName(subcategoryName);
	    
	    // Fetch items under that subcategory
	    return itemrepo.findBySubcategory(subcategory);
	}

//	public Subcategory addSubcategory(SubcategoryCreateDTO subcategorydto) {
//		Subcategory subcategory = new Subcategory();
//		Category category=categoryRepo.findById(subcategorydto.getCategoryId())
//					.orElseThrow(() -> new IllegalArgumentException("Category with ID " + subcategorydto.getCategoryId() + " not found"));
//		subcategory.setCategory(category);
//		subcategory.setName(subcategorydto.getName());
//		return subcategory;
//		
//	}
	public Subcategory addSubcategory(SubcategoryCreateDTO subcategorydto, MultipartFile image) throws IOException {
	    // Validate image
	    if (image == null || image.isEmpty()) {
	        throw new IllegalArgumentException("Image file is required");
	    }

	    // Create filename
	    String filename = subcategorydto.getName().toLowerCase().replaceAll("\\s+", "") +
	            getFileExtension(image.getOriginalFilename());

	    // Create upload directory if not exists
	    File uploadDir = new File(backendImagesDir);
	    if (!uploadDir.exists()) {
	        uploadDir.mkdirs();
	    }

	    // Save the image
	    Path filePath = Paths.get(backendImagesDir, filename);
	    Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

	    // Build and save subcategory
	    Subcategory subcategory = new Subcategory();
	    Category category = categoryRepo.findById(subcategorydto.getCategoryId())
	        .orElseThrow(() -> new IllegalArgumentException("Category with ID " + subcategorydto.getCategoryId() + " not found"));
	    
	    subcategory.setCategory(category);
	    subcategory.setName(subcategorydto.getName());
	    subcategory.setImagePath("/images/" + filename); // Same pattern as items

	    return subcategoryrepo.save(subcategory);
	}
	
	
	public List<Subcategory> getAllsubcategories() {
		return subcategoryrepo.findAll();
	}
    private String getFileExtension(String filename) {
        return filename != null && filename.contains(".")
            ? filename.substring(filename.lastIndexOf("."))
            : ".jpg";
    }

	

}

