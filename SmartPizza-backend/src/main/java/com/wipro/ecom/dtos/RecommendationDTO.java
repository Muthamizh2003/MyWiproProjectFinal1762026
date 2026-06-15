package com.wipro.ecom.dtos;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class RecommendationDTO {

    private String title;               // Combo name
    private List<ProductDTO> products;  // matched products
    private double totalPrice;          // calculated
    private String aiText;              // raw AI output
}