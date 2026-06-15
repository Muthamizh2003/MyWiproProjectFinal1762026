package com.wipro.ecom.services;

import java.util.List;

import com.wipro.ecom.dtos.OrderDTO;

public interface OrderService {

    OrderDTO placeOrder(Long userId, Long addressId, String couponCode);

    List<OrderDTO> getUserOrders(Long userId);

    List<OrderDTO> getOrdersByStatus(String status);

    List<OrderDTO> getHighValueOrders(double amount);

    List<OrderDTO> getTopOrders();
    
    void cancelOrder(Long orderId);
}
