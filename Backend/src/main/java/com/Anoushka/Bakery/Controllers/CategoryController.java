package com.Anoushka.Bakery.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Anoushka.Bakery.Models.Category;
import com.Anoushka.Bakery.Models.Item;
import com.Anoushka.Bakery.Models.Subcategory;
import com.Anoushka.Bakery.Services.CategoryService;
import com.Anoushka.Bakery.Services.ItemService;
import com.Anoushka.Bakery.Services.SubcategoryService;

@RestController
@RequestMapping("/categories")
@CrossOrigin(origins = "${cors.allowed.origins}"") // Allow requests from React app

public class CategoryController {
	@Autowired
	private CategoryService categoryservice;
	@Autowired
	private ItemService itemservice;
	
	@Autowired
	private SubcategoryService subcategoryservice;
	
	@GetMapping
	public List<Category> getCategories(){
		return categoryservice.getAllCategories();
	}
	
	@GetMapping("/{categoryName}/items")
	public List<Item> getItemsByCategory(@PathVariable String categoryName){
		return itemservice.getItemsByCategoryName(categoryName);
	}
	
	 @GetMapping("/{categoryName}/subcategories")
	    public List<Subcategory> getSubcategoriesByCategory(@PathVariable String categoryName) {
	        return subcategoryservice.findSubcategoriesByCategoryName(categoryName);
	    }
	 
	 
}
