package com.Anoushka.Bakery.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.Anoushka.Bakery.Models.Subcategory;

public interface SubcategoryRepository extends JpaRepository<Subcategory, Integer> {
	@Query("SELECT new com.Anoushka.Bakery.Models.Subcategory(s.id, s.name) FROM Subcategory s WHERE s.category.name = :categoryName")
	List<Subcategory> findSubcategoryNamesByCategoryName(@Param("categoryName") String categoryName);

	Subcategory findByName(String subcategoryName);

}
