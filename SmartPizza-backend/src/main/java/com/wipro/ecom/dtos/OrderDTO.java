package com.wipro.ecom.dtos;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class OrderDTO {

    private Long id;
    private Long userId;
    private String userName;

    private double totalAmount;
    private double taxAmount;
    private String status;
    private LocalDateTime createdAt;
    private AddressDTO deliveryAddress;

    private List<OrderItemDTO> items;

    private String deliveryAgentName;
    private String deliveryStatus;
}