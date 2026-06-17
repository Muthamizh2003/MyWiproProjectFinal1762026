package com.wipro.ecom.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import com.wipro.ecom.dtos.PaymentDTO;
import com.wipro.ecom.services.PaymentService;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/payment")
public class PaymentController {

	private static final Logger log = LoggerFactory.getLogger(PaymentController.class);

	@Autowired
    private PaymentService paymentService;

    //CREATE RAZORPAY ORDER
    @PostMapping("/create/{orderId}")
    public Map<String, Object> createPaymentOrder(@PathVariable Long orderId) {
        log.info("Creating payment order for order: {}", orderId);
        return paymentService.createPaymentOrder(orderId);
    }

    //CONFIRM PAYMENT (after frontend success)
    @PostMapping("/confirm/{orderId}")
    public PaymentDTO confirmPayment(@PathVariable Long orderId,
                                     @RequestParam String paymentId) {
        log.info("Confirming payment for order: {}, paymentId: {}", orderId, paymentId);
        return paymentService.confirmPayment(orderId, paymentId);
    }

    //GET PAYMENT DETAILS BY ORDER
    @GetMapping("/{orderId}")
    public PaymentDTO getPayment(@PathVariable Long orderId) {
        log.info("Fetching payment for order: {}", orderId);
        return paymentService.getPaymentByOrder(orderId);
    }

    //GENERATE INVOICE
    @GetMapping("/invoice/{orderId}")
    public String generateInvoice(@PathVariable Long orderId) {
        log.info("Generating invoice for order: {}", orderId);
        return paymentService.generateInvoice(orderId);
    }

    //SIMULATED PAYMENT
    @PostMapping("/pay")
    public PaymentDTO processPayment(@Valid @RequestBody PaymentDTO dto) {
        log.info("Processing payment for order: {}", dto.getOrderId());
        return paymentService.processPayment(dto);
    }
}