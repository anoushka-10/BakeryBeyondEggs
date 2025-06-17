package com.Anoushka.Bakery.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.Anoushka.Bakery.DTO.ItemDTO;
import com.Anoushka.Bakery.DTO.SubcategoryCreateDTO;
import com.Anoushka.Bakery.Models.Subcategory;
import com.Anoushka.Bakery.Services.ItemService;
import com.Anoushka.Bakery.Services.SubcategoryService;

import io.jsonwebtoken.io.IOException;

@RestController
@CrossOrigin(origins = "${cors.allowed.origins}")
@RequestMapping("/subcategories")
public class SubcategoryController {
	@Autowired
	private ItemService itemservice;
	
	
	
	@Autowired
	private SubcategoryService subcategoryservice;
	
	@GetMapping("/{subcategoryName}/items")
	public List<ItemDTO> getItemsBySubcategory(@PathVariable String subcategoryName) {
	    return itemservice.getItemsBySubcategory(subcategoryName);
	}
//	
//	@PostMapping("/addSubcategory")
//	public Subcategory addSubcategoryinCategory(@RequestBody SubcategoryCreateDTO subcategory) {
//		return subcategoryservice.addSubcategory(subcategory);
//	}
	
	@PostMapping("/addSubcategory")
	public Subcategory addSubcategoryinCategory(
	    @RequestPart("subcategoryRequest") SubcategoryCreateDTO subcategory,
	    @RequestPart("image") MultipartFile image) throws IOException, java.io.IOException {
	    
	    return subcategoryservice.addSubcategory(subcategory, image);
	}
	
	@GetMapping("/getAll")
	public List<Subcategory> GetallSUbcategories(){
		return subcategoryservice.getAllsubcategories();
	}
	

}
