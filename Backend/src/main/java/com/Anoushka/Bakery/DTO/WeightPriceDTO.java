package com.Anoushka.Bakery.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WeightPriceDTO {
		private int id;
	    private String weight;
	    private double price;
}
