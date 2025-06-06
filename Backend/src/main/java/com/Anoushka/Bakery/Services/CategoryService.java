package com.Anoushka.Bakery.Services;



import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Anoushka.Bakery.DTO.CategoryDTORequest;
import com.Anoushka.Bakery.Models.Category;
import com.Anoushka.Bakery.Models.Subcategory;
import com.Anoushka.Bakery.Repositories.CategoryRepository;

@Service
public class CategoryService {
	
	@Autowired
	private CategoryRepository categoryrepo;
	
	
	public List<Category> getAllCategories() {
		return categoryrepo.findAllCategories();
	}


public List<Subcategory> getSubcategoryBycategory(String categoryName) {
		
	return categoryrepo.findSubcategoriesByCategoryName(categoryName);
    
}


public Category addcategory(CategoryDTORequest categoryRequest) {
	Category category =new Category();
	category.setName(categoryRequest.getName());
	category.setSubcategories(categoryRequest.getSubcategories());
	categoryrepo.save(category);
	return null;
}
}