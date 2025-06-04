package com.Anoushka.Bakery.Services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Anoushka.Bakery.DTO.CategoryIdDTO;
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

	public Subcategory addSubcategory(SubcategoryCreateDTO subcategorydto) {
		Subcategory subcategory = new Subcategory();
		Category category=categoryRepo.findById(subcategorydto.getCategoryId())
					.orElseThrow(() -> new IllegalArgumentException("Category with ID " + subcategorydto.getCategoryId() + " not found"));
		subcategory.setCategory(category);
		subcategory.setName(subcategorydto.getName());
		return subcategory;
		
	}

	public List<Subcategory> getAllsubcategories() {
		return subcategoryrepo.findAll();
	}

	

}

