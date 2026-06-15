package com.wipro.ecom.services;

import java.util.List;

import com.wipro.ecom.dtos.CartItemDTO;

public interface CartService {

    void addToCart(Long userId, Long productId, int quantity);

    List<CartItemDTO> getCart(Long userId);

    void updateQuantity(Long userId, Long productId, int quantity);

    void removeItem(Long userId, Long productId);

    void clearCart(Long userId);
}