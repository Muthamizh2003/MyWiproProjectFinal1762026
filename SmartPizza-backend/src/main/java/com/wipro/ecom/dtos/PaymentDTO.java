package com.wipro.ecom.dtos;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class PaymentDTO {

    @NotNull(message = "Order ID is required")
    private Long orderId;

    private String paymentId;

    private double amount;

    private String status;
    private String paymentMethod;
}