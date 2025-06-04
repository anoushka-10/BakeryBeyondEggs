package com.Anoushka.Bakery.DTO;

import java.util.List;

import com.Anoushka.Bakery.Models.Subcategory;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoryDTORequest {
	private String name;
	private List<Subcategory> subcategories;
	
}
