package com.wipro.ecom.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import com.wipro.ecom.entities.CartItem;

import org.springframework.transaction.annotation.Transactional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findByUserId(Long userId);


    @Modifying 
    @Transactional
    void deleteByUserId(Long userId);
    
    Optional<CartItem> findByUser_IdAndProduct_Id(Long userId, Long productId);

}