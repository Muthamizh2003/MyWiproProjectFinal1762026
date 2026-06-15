package com.wipro.ecom.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.wipro.ecom.dtos.OrderDTO;
import com.wipro.ecom.services.OrderService;


@RestController
@RequestMapping("/orders")
public class OrderController {

	@Autowired
    private OrderService orderService;

    //PLACE ORDER
    @PostMapping("/place")
    public OrderDTO placeOrder(@RequestParam Long userId,
                              @RequestParam Long addressId,
                              @RequestParam(required = false) String couponCode) {

        return orderService.placeOrder(userId, addressId, couponCode);
    }

    //GET USER ORDERS
    @GetMapping("/user/{userId}")
    public List<OrderDTO> getUserOrders(@PathVariable Long userId) {
        return orderService.getUserOrders(userId);
    }

    //GET ORDERS BY STATUS
    @GetMapping("/status/{status}")
    public List<OrderDTO> getOrdersByStatus(@PathVariable String status) {
        return orderService.getOrdersByStatus(status);
    }

    //GET HIGH VALUE ORDERS
    @GetMapping("/high-value/{amount}")
    public List<OrderDTO> getHighValueOrders(@PathVariable double amount) {
        return orderService.getHighValueOrders(amount);
    }

    //GET TOP ORDERS
    @GetMapping("/top")
    public List<OrderDTO> getTopOrders() {
        return orderService.getTopOrders();
    }

    //CANCEL ORDER
    @PutMapping("/cancel/{orderId}")
    public String cancelOrder(@PathVariable Long orderId) {

        orderService.cancelOrder(orderId);
        return "Order cancelled successfully";
    }
}