package com.wipro.ecom.serviceimpl;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wipro.ecom.dtos.PaymentDTO;
import com.wipro.ecom.entities.Order;
import com.wipro.ecom.entities.OrderItem;
import com.wipro.ecom.entities.Payment;
import com.wipro.ecom.repository.OrderRepository;
import com.wipro.ecom.repository.PaymentRepository;
import com.wipro.ecom.services.DeliveryService;
import com.wipro.ecom.services.PaymentService;
import com.wipro.ecom.services.RazorpayService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class PaymentServiceImpl implements PaymentService {

	private static final Logger log = LoggerFactory.getLogger(PaymentServiceImpl.class);

	@Autowired
    private PaymentRepository paymentRepo;
	
	@Autowired
    private OrderRepository orderRepo;

    //PROCESS PAYMENT
    @Override
    public PaymentDTO processPayment(PaymentDTO dto) {
        log.info("Processing payment for order: {}", dto.getOrderId());

    	Order order = orderRepo.findById(dto.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));
		
    	if (paymentRepo.findByOrderId(dto.getOrderId()).isPresent()) {
    	    log.warn("Payment already completed for order: {}", dto.getOrderId());
    	    throw new RuntimeException("Payment already completed");
    	}


        Payment payment = new Payment();
        payment.setPaymentId("PAY-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        payment.setOrder(order);
        payment.setAmount(order.getTotalAmount());
        payment.setPaymentMethod(dto.getPaymentMethod());
        payment.setStatus("SUCCESS");

        payment = paymentRepo.save(payment);

        // ✅ Update order status
        order.setStatus("CONFIRMED");
        orderRepo.save(order);

        // ✅ Auto-start delivery
        try { deliveryService.startDelivery(dto.getOrderId()); } catch (Exception e) {
            log.error("Failed to auto-start delivery for order: {}", dto.getOrderId(), e);
        }

        log.info("Payment processed successfully for order: {}", dto.getOrderId());
        return mapToDTO(payment);
    }

    //GET PAYMENT BY ORDER
    @Override
    public PaymentDTO getPaymentByOrder(Long orderId) {
        log.info("Fetching payment for order: {}", orderId);

        Payment payment = paymentRepo.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        return mapToDTO(payment);
    }

    // GENERATE INVOICE 
    @Override
    public String generateInvoice(Long orderId) {
        log.info("Generating invoice for order: {}", orderId);

        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        StringBuilder invoice = new StringBuilder();

        invoice.append("\n===== INVOICE =====\n");
        invoice.append("Order ID: ").append(order.getId()).append("\n");
        invoice.append("User: ").append(order.getUser().getUsername()).append("\n\n");

        double subtotal = 0;

        for (OrderItem item : order.getItems()) {

            invoice.append(item.getProduct().getName())
                    .append(" x ")
                    .append(item.getQuantity())
                    .append(" = ")
                    .append(item.getPrice() * item.getQuantity())
                    .append("\n");

            subtotal += item.getPrice() * item.getQuantity();
        }

        invoice.append("\nSubtotal: ").append(subtotal);
        invoice.append("\nTax: ").append(order.getTaxAmount());
        invoice.append("\nTotal: ").append(order.getTotalAmount());

        invoice.append("\n===================\n");

        return invoice.toString();
    }

    // ✅ MAPPER
    private PaymentDTO mapToDTO(Payment p) {

        PaymentDTO dto = new PaymentDTO();
        dto.setOrderId(p.getOrder().getId());
        dto.setAmount(p.getAmount());
        dto.setStatus(p.getStatus());
        dto.setPaymentMethod(p.getPaymentMethod());
        dto.setPaymentId(p.getPaymentId());
        return dto;
    }
    
    @Autowired
    private RazorpayService razorpayService;

    @Autowired
    private DeliveryService deliveryService;

    @Override
    public Map<String, Object> createPaymentOrder(Long orderId) {
        log.info("Creating Razorpay payment order for order: {}", orderId);
    	
    	if (paymentRepo.findByOrderId(orderId).isPresent()) {
    	    log.warn("Payment already completed for order: {}", orderId);
    	    throw new RuntimeException("Payment already completed");
    	}
    	
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        try {

            com.razorpay.Order razorOrder =
                    razorpayService.createOrder(order.getTotalAmount());

            Map<String, Object> response = new HashMap<>();
            response.put("razorpayOrderId", razorOrder.get("id"));
            response.put("amount", (int)(order.getTotalAmount() * 100)); 
            response.put("displayAmount", order.getTotalAmount()); 
            response.put("currency", "INR");

            log.info("Razorpay order created for order: {}", orderId);
            return response;

        } catch (Exception e) {
            log.error("Failed to initiate payment for order: {}", orderId, e);
            throw new RuntimeException("Payment initiation failed");
        }
    }
    
    @Override
    @Transactional
    public PaymentDTO confirmPayment(Long orderId, String paymentId) {
        log.info("Confirming payment for order: {}, paymentId: {}", orderId, paymentId);
    	
    	if (paymentRepo.findByOrderId(orderId).isPresent()) {
    	    log.warn("Payment already confirmed for order: {}", orderId);
    	    throw new RuntimeException("Payment already confirmed");
    	}

        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setAmount(order.getTotalAmount());
        payment.setPaymentMethod("RAZORPAY");
        payment.setStatus("SUCCESS");
        payment.setPaymentId(paymentId);
        
        payment = paymentRepo.save(payment);

        order.setStatus("CONFIRMED");
        orderRepo.save(order);

        try { deliveryService.startDelivery(orderId); } catch (Exception e) {
            log.error("Failed to auto-start delivery for order: {}", orderId, e);
        }

        log.info("Payment confirmed successfully for order: {}", orderId);
        return mapToDTO(payment);
    }
}
