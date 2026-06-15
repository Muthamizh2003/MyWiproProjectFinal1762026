package com.wipro.ecom.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.wipro.ecom.entities.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}
