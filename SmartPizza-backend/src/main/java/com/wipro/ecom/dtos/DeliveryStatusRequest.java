package com.wipro.ecom.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class DeliveryStatusRequest {

    @NotNull
    private Long deliveryId;

    @NotBlank
    private String status;
}
