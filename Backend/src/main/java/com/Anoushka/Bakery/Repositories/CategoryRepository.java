package com.Anoushka.Bakery.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.Anoushka.Bakery.Models.Category;
import com.Anoushka.Bakery.Models.Subcategory;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {

	@Query("SELECT new Category(c.id,c.name) FROM Category c")
	List<Category> findAllCategories();

	@Query("SELECT new com.Anoushka.Bakery.Models.Subcategory(s.id, s.name) FROM Category c JOIN c.subcategories s WHERE c.name = :categoryName")
	List<Subcategory> findSubcategoriesByCategoryName(@Param("categoryName") String categoryName);

	Category findByName(String categoryName);

	

	

	

}
