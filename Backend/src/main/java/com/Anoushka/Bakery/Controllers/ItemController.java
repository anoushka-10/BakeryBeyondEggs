package com.Anoushka.Bakery.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import com.Anoushka.Bakery.DTO.ItemDTO;
import com.Anoushka.Bakery.Models.Item;
import com.Anoushka.Bakery.Services.ItemService;

import io.jsonwebtoken.io.IOException;

@Controller
@RequestMapping("/items")
public class ItemController {
	
	@Autowired
	private ItemService itemservice;
	
	@PostMapping("/additems")
	public ResponseEntity<Item> addItem(
	    @RequestPart("itemRequest") ItemDTO itemRequest,
	    @RequestPart("image") MultipartFile image) throws IOException, java.io.IOException {

	    Item savedItem = itemservice.addItem(itemRequest, image);
	    return ResponseEntity.ok(savedItem);
	}
	
	@PutMapping("/edititem/{id}")
	public ResponseEntity<Item> editItem(
	        @RequestPart("itemRequest") ItemDTO itemRequest,
	        @RequestPart(value = "image", required = false) MultipartFile image) throws IOException, java.io.IOException {
	    
	    Item updatedItem = itemservice.editItem( itemRequest, image);
	    return ResponseEntity.ok(updatedItem);
	}
}
