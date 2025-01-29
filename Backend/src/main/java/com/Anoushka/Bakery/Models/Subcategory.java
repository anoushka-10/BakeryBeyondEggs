package com.Anoushka.Bakery.Models;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name="subcategories")
public class Subcategory {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	@Column(nullable=false)
	private String name;
	
	@ManyToOne
	@JoinColumn(name="category_id",nullable=false)
	@JsonBackReference
	private Category category;
	
	@OneToMany(mappedBy = "subcategory", cascade= CascadeType.ALL, orphanRemoval=true)
	private List<Item> items;
	
	
	public long getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Category getCategory() {
		return category;
	}

	public void setCategory(Category category) {
		this.category = category;
	}

	public List<Item> getItems() {
		return items;
	}

	public void setItems(List<Item> items) {
		this.items = items;
	}

	public Subcategory(int id, String name, Category category, List<Item> items) {
		super();
		this.id = id;
		this.name = name;
		this.category = category;
		this.items = items;
	}

	public Subcategory() {
		
	}

	public Subcategory(int id, String name) {
		super();
		this.id = id;
		this.name = name;
		
	}
	
	

}
