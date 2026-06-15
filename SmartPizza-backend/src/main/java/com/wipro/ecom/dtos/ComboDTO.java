package com.wipro.ecom.dtos;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ComboDTO {

    private List<ProductDTO> products;
    private double totalPrice;
    private String comboName;
    private String aiSuggestion;
}