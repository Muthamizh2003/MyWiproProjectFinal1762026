package com.wipro.ecom.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class DeliveryAgentDTO {

    private Long id;
    private String name;
    private String phone;
    private boolean available;
    private Long userId;
}