package com.wipro.ecom.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "deliveries")
@Getter @Setter
public class Delivery {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String status;
    
    @DecimalMin("-90.0") @DecimalMax("90.0")
    private double latitude;
    
    @DecimalMin("-180.0") @DecimalMax("180.0")
    private double longitude;

    @OneToOne
    @JoinColumn(name="order_id")
    private Order order;

    private Double deliveryTime;
    
    @ManyToOne
    @JoinColumn(name="agent_id")
    private DeliveryAgent agent;
}