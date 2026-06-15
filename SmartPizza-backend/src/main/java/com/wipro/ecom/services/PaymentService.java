package com.wipro.ecom.services;

import java.util.Map;

import com.wipro.ecom.dtos.PaymentDTO;

public interface PaymentService {

    PaymentDTO processPayment(PaymentDTO dto);

    PaymentDTO getPaymentByOrder(Long orderId);

    String generateInvoice(Long orderId);
    
    Map<String, Object> createPaymentOrder(Long orderId);
    
    PaymentDTO confirmPayment(Long orderId, String paymentId);
}
