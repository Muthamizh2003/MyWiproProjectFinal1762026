package com.wipro.ecom.dtos;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CouponDTO {

    private Long id;

    @NotBlank(message = "Coupon code is required")
    private String code;

    @Positive(message = "Discount must be positive")
    private double discount;

    @NotBlank(message = "Discount type is required")
    private String type;

    private double minOrderAmount;

    private LocalDateTime expiryDate;
}
