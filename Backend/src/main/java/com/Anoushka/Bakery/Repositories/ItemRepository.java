package com.Anoushka.Bakery.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.Anoushka.Bakery.Models.Item;
import com.Anoushka.Bakery.Models.Subcategory;

@Repository
public interface ItemRepository extends JpaRepository<Item, Integer>{

	  @Query("SELECT i FROM Item i WHERE i.subcategory.category.id = :categoryId")
	    List<Item> findByCategoryId(@Param("categoryId") int categoryId);

	List<Item> findBySubcategory(Subcategory subcategory);

}
