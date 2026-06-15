package com.wipro.ecom.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CouponResponseDTO {

    private String code;
    private double discountAmount;
    private double finalAmount;
    private String message;
}