package com.Anoushka.Bakery.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.Anoushka.Bakery.Models.Item;
import com.Anoushka.Bakery.Services.ItemService;

@RestController
@CrossOrigin(origins = "${cors.allowed.origins}")
public class SubcategoryController {
	@Autowired
	private ItemService itemservice;
	
	@GetMapping("/subcategories/{subcategoryName}/items")
	public List<Item> getItemsBySubcategory(@PathVariable String subcategoryName) {
	    return itemservice.getItemsBySubcategory(subcategoryName);
	}


}
