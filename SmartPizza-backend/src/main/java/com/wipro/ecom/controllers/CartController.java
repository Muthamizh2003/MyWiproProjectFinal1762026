package com.wipro.ecom.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.wipro.ecom.dtos.CartItemDTO;
import com.wipro.ecom.services.CartService;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {

    private static final Logger log = LoggerFactory.getLogger(CartController.class);

    private final CartService cartService;

    //ADD TO CART
    @PostMapping("/add")
    public String addToCart(@RequestParam Long userId,
                            @RequestParam Long productId,
                            @RequestParam int quantity) {

        log.info("Adding product {} to cart for user {}, quantity: {}", productId, userId, quantity);
        cartService.addToCart(userId, productId, quantity);
        return "Item added to cart";
    }

    //GET CART ITEMS
    @GetMapping("/{userId}")
    public List<CartItemDTO> getCart(@PathVariable Long userId) {
        log.info("Fetching cart for user: {}", userId);
        return cartService.getCart(userId);
    }

    //UPDATE QUANTITY
    @PutMapping("/update")
    public String updateQuantity(@RequestParam Long userId,
                                 @RequestParam Long productId,
                                 @RequestParam int quantity) {

        log.info("Updating quantity for user {}, product {}, quantity: {}", userId, productId, quantity);
        cartService.updateQuantity(userId, productId, quantity);
        return "Cart updated";
    }

    //REMOVE ITEM
    @DeleteMapping("/remove")
    public String removeItem(@RequestParam Long userId,
                             @RequestParam Long productId) {

        log.info("Removing product {} from cart for user {}", productId, userId);
        cartService.removeItem(userId, productId);
        return "Item removed from cart";
    }

    //CLEAR CART
    @DeleteMapping("/clear/{userId}")
    public String clearCart(@PathVariable Long userId) {
        log.info("Clearing cart for user: {}", userId);
        cartService.clearCart(userId);
        return "Cart cleared";
    }
}