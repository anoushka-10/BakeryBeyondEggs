package com.Anoushka.Bakery;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class BakeryBeyondEggsApplication {

	public static void main(String[] args) {
		SpringApplication.run(BakeryBeyondEggsApplication.class, args);
	}

}
