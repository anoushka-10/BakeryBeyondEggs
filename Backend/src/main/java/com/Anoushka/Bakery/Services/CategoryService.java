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

import com.Anoushka.Bakery.DTO.CategoryDTORequest;
import com.Anoushka.Bakery.Models.Category;
import com.Anoushka.Bakery.Models.Subcategory;
import com.Anoushka.Bakery.Repositories.CategoryRepository;

@Service
public class CategoryService {
	
	@Autowired
	private CategoryRepository categoryrepo;
	
	@Value("${backend.images.dir}")
    private String backendImagesDir;
	
	public List<Category> getAllCategories() {
		return categoryrepo.findAll();
	}


public List<Subcategory> getSubcategoryBycategory(String categoryName) {
		
	return categoryrepo.findSubcategoriesByCategoryName(categoryName);
    
}
private String getFileExtension(String filename) {
    return filename != null && filename.contains(".")
        ? filename.substring(filename.lastIndexOf("."))
        : ".jpg";
}
public Category addCategory(CategoryDTORequest categoryRequest, MultipartFile image) throws IOException {
    // Validate image
    if (image == null || image.isEmpty()) {
        throw new IllegalArgumentException("Image file is required");
    }

    // Create filename
    String filename = categoryRequest.getName().toLowerCase().replaceAll("\\s+", "") +
            getFileExtension(image.getOriginalFilename());

    // Create upload directory if not exists
    File uploadDir = new File(backendImagesDir);
    if (!uploadDir.exists()) {
        uploadDir.mkdirs();
    }

    // Save the image
    Path filePath = Paths.get(backendImagesDir, filename);
    Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

    // Build and save category
    Category category = new Category();
    category.setName(categoryRequest.getName());
    category.setImagePath("/images/" + filename); // Add this field to Category entity
    // Note: Remove the subcategories line - you shouldn't set subcategories when creating a category
    // category.setSubcategories(categoryRequest.getSubcategories()); // This line should be removed
    
    return categoryrepo.save(category); // Return the saved category, not null
}


//public Category addcategory(CategoryDTORequest categoryRequest) {
//	Category category =new Category();
//	category.setName(categoryRequest.getName());
//	category.setSubcategories(categoryRequest.getSubcategories());
//	categoryrepo.save(category);
//	return null;
//}
}