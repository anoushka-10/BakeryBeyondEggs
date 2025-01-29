package com.Anoushka.Bakery.Models;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name="items")
public class Item {

	    @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private int id;

	    @Column(nullable = false)
	    private String name;

	    @ManyToOne
	    @JoinColumn(name = "subcategory_id", nullable = false)
	    @JsonBackReference
	    private Subcategory subcategory;
	    
	    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
	    @JsonManagedReference
	    private List<WeightPrice> weightPrices;
	    
	    public Item() {
			super();
		}

		private String description;

		public int getId() {
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

		public Subcategory getSubcategory() {
			return subcategory;
		}

		public void setSubcategory(Subcategory subcategory) {
			this.subcategory = subcategory;
		}

		public List<WeightPrice> getWeightPrices() {
			return weightPrices;
		}

		public void setWeightPrices(List<WeightPrice> weightPrices) {
			this.weightPrices = weightPrices;
		}

		public String getDescription() {
			return description;
		}

		public void setDescription(String description) {
			this.description = description;
		}

		public Item(int id, String name, Subcategory subcategory, List<WeightPrice> weightPrices, String description) {
			super();
			this.id = id;
			this.name = name;
			this.subcategory = subcategory;
			this.weightPrices = weightPrices;
			this.description = description;
		}


}
