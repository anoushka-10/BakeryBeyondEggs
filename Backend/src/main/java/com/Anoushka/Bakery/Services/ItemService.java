package com.Anoushka.Bakery.Services;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Anoushka.Bakery.Models.Category;
import com.Anoushka.Bakery.Models.Item;
import com.Anoushka.Bakery.Models.Subcategory;
import com.Anoushka.Bakery.Repositories.CategoryRepository;
import com.Anoushka.Bakery.Repositories.ItemRepository;
import com.Anoushka.Bakery.Repositories.SubcategoryRepository;

@Service
public class ItemService {
    
    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private SubcategoryRepository subcategoryrepo;

    public List<Item> getItemsByCategoryName(String categoryName) {
       
        Category category = categoryRepository.findByName(categoryName);
        
        if (category != null) {
          
            return category.getSubcategories()
                           .stream()
                           .flatMap(subcategory -> subcategory.getItems().stream())
                           .peek(item -> item.getWeightPrices().size())
                           .collect(Collectors.toList());
        }
        
        return new ArrayList<>(); // Return empty list if category not found
    }

	public List<Item> getItemsBySubcategory(String subcategoryName) {
		
	    Subcategory subcategory = subcategoryrepo.findByName(subcategoryName);
	    	    return itemRepository.findBySubcategory(subcategory);
	}

	
}
