package com.wipro.ecom.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.wipro.ecom.dtos.OrderDTO;
import com.wipro.ecom.services.OrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@RestController
@RequestMapping("/orders")
public class OrderController {

	private static final Logger log = LoggerFactory.getLogger(OrderController.class);

	@Autowired
    private OrderService orderService;

    //PLACE ORDER
    @PostMapping("/place")
    public OrderDTO placeOrder(@RequestParam Long userId,
                              @RequestParam Long addressId,
                              @RequestParam(required = false) String couponCode) {

        log.info("Placing order for user: {}, address: {}, coupon: {}", userId, addressId, couponCode);
        return orderService.placeOrder(userId, addressId, couponCode);
    }

    //GET USER ORDERS
    @GetMapping("/user/{userId}")
    public List<OrderDTO> getUserOrders(@PathVariable Long userId) {
        log.info("Fetching orders for user: {}", userId);
        return orderService.getUserOrders(userId);
    }

    //GET ORDERS BY STATUS
    @GetMapping("/status/{status}")
    public List<OrderDTO> getOrdersByStatus(@PathVariable String status) {
        log.info("Fetching orders by status: {}", status);
        return orderService.getOrdersByStatus(status);
    }

    //GET HIGH VALUE ORDERS
    @GetMapping("/high-value/{amount}")
    public List<OrderDTO> getHighValueOrders(@PathVariable double amount) {
        log.info("Fetching high value orders above: {}", amount);
        return orderService.getHighValueOrders(amount);
    }

    //GET TOP ORDERS
    @GetMapping("/top")
    public List<OrderDTO> getTopOrders() {
        log.info("Fetching top orders");
        return orderService.getTopOrders();
    }

    //CANCEL ORDER
    @PutMapping("/cancel/{orderId}")
    public String cancelOrder(@PathVariable Long orderId) {
        log.info("Cancelling order: {}", orderId);
        orderService.cancelOrder(orderId);
        return "Order cancelled successfully";
    }
}