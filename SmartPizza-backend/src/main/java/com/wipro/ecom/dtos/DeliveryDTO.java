package com.wipro.ecom.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class DeliveryDTO {

	private double eta;
    private Long id;
    private Long orderId;
    private String status;
    
    private double latitude;
    private double longitude;

    private String agentName;

    private double customerLatitude;
    private double customerLongitude;
}