package com.wipro.ecom.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CartItemDTO {

    private Long id;
    private Long productId;
    private String productName;
    private int quantity;
    private double price;
}
