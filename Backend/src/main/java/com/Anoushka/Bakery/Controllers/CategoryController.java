package com.Anoushka.Bakery.Controllers;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.Anoushka.Bakery.DTO.CategoryDTORequest;
import com.Anoushka.Bakery.DTO.ItemDTO;
import com.Anoushka.Bakery.Models.Category;
import com.Anoushka.Bakery.Models.Subcategory;
import com.Anoushka.Bakery.Services.CategoryService;
import com.Anoushka.Bakery.Services.ItemService;
import com.Anoushka.Bakery.Services.SubcategoryService;

@RestController
@RequestMapping("/categories")
@CrossOrigin(origins = "${cors.allowed.origins}") // Allow requests from React app

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
	public List<ItemDTO> getItemsByCategory(@PathVariable String categoryName){
		return itemservice.getItemsByCategoryName(categoryName);
	}
	
	 @GetMapping("/{categoryName}/subcategories")
	    public List<Subcategory> getSubcategoriesByCategory(@PathVariable String categoryName) {
	        return subcategoryservice.findSubcategoriesByCategoryName(categoryName);
	    }
	 
//	 @PostMapping("/addCategory")
//	 public Category addCategory(@RequestBody CategoryDTORequest categoryRequest) {
//		 return categoryservice.addcategory(categoryRequest);
//	 }
	 
	 @PostMapping("/addcategory")
	 public ResponseEntity<Category> addCategory(
	     @RequestPart("categoryRequest") CategoryDTORequest categoryRequest,
	     @RequestPart("image") MultipartFile image) throws IOException {
	     
	     Category savedCategory = categoryservice.addCategory(categoryRequest, image);
	     return ResponseEntity.ok(savedCategory);
	 }
	 
	 @GetMapping("/getallcategories")
	 public List<Category> getcategories(){
		 return categoryservice.getAllCategories();
	 }
//	 
//	 @PostMapping("/addSubcategory")
//		public Subcategory addSubCategory(@)
}
