package com.Anoushka.Bakery.Models;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name="categories")
public class Category {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	@Column(nullable=false)
	private String name;
	
	@Column(name="image_path") // Add this field for storing image path
	private String imagePath;
	
	@OneToMany(mappedBy = "category", cascade = CascadeType.ALL, fetch=FetchType.EAGER,orphanRemoval = true)
	@JsonManagedReference
	private List<Subcategory> subcategories;

	public Category(int id, String name) {
	    this.id = id;
	    this.name = name;
	}

}
