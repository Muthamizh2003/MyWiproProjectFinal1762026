package com.wipro.ecom.entities;

import java.time.LocalDateTime;

import com.wipro.ecom.enumpackage.DiscountType;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "coupons")
@Getter @Setter
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String code;

    private double discount;

    @Enumerated(EnumType.STRING)
    private DiscountType type;

    private double minOrderAmount;

    private LocalDateTime expiryDate;
}