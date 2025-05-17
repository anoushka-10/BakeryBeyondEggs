package com.Anoushka.Bakery.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Anoushka.Bakery.Models.WeightPrice;

@Repository
public interface weightpriceRepo extends JpaRepository<WeightPrice,Integer> {

	
}
