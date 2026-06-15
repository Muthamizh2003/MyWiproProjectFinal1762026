package com.wipro.ecom.dtos;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class DeliveryLocationRequest {

    @NotNull
    private Long deliveryId;

    @NotNull
    private Double latitude;

    @NotNull
    private Double longitude;
}
