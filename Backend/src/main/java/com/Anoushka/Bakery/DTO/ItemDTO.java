package com.Anoushka.Bakery.DTO;

import java.util.List;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class ItemDTO {
	private Integer id;
	 private String name;
	 private String description;
	 private String imagepath;
	 private Integer subcategoryid;  // Use DTO here
     private List<WeightPriceDTO> weightPrices;
     
     public ItemDTO(String name, String description, Integer subcategoryid, List<WeightPriceDTO> weightPrices) {
         this.name = name;
         this.description = description;
         this.subcategoryid = subcategoryid;
         this.weightPrices = weightPrices;
     }
     
//     // Constructor for fetching existing items (with ID and imagepath)
//     public ItemDTO(Integer id, String name, String description, String imagepath, Integer subcategoryid, List<WeightPriceDTO> weightPrices) {
//         this.id = id;
//         this.name = name;
//         this.description = description;
//         this.imagepath = imagepath;
//         this.subcategoryid = subcategoryid;
//         this.weightPrices = weightPrices;
//     }
     
}
