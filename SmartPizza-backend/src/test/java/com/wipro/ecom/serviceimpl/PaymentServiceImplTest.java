package com.wipro.ecom.serviceimpl;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.wipro.ecom.dtos.PaymentDTO;
import com.wipro.ecom.entities.Order;
import com.wipro.ecom.entities.OrderItem;
import com.wipro.ecom.entities.Payment;
import com.wipro.ecom.entities.Product;
import com.wipro.ecom.entities.User;
import com.wipro.ecom.repository.OrderRepository;
import com.wipro.ecom.repository.PaymentRepository;
import com.wipro.ecom.services.DeliveryService;

@ExtendWith(MockitoExtension.class)
class PaymentServiceImplTest {

    @Mock
    private PaymentRepository paymentRepo;
    @Mock
    private OrderRepository orderRepo;
    @Mock
    private DeliveryService deliveryService;

    @InjectMocks
    private PaymentServiceImpl paymentService;

    private Order order;
    private Payment payment;

    @BeforeEach
    void setUp() {
        User user = new User();
        user.setId(1L);
        user.setUsername("testuser");

        order = new Order();
        order.setId(100L);
        order.setUser(user);
        order.setTotalAmount(1210);
        order.setTaxAmount(110);
        order.setStatus("PENDING_PAYMENT");
        order.setCreatedAt(LocalDateTime.now());

        Product product = new Product();
        product.setId(1L);
        product.setName("Margherita");

        OrderItem item = new OrderItem();
        item.setProduct(product);
        item.setQuantity(2);
        item.setPrice(300);
        item.setOrder(order);
        order.setItems(List.of(item));

        payment = new Payment();
        payment.setId(50L);
        payment.setPaymentId("PAY-ABC12345");
        payment.setOrder(order);
        payment.setAmount(1210);
        payment.setPaymentMethod("COD");
        payment.setStatus("SUCCESS");
    }

    @Test
    void testProcessPayment_Success() {
        PaymentDTO dto = new PaymentDTO();
        dto.setOrderId(100L);
        dto.setPaymentMethod("COD");

        when(orderRepo.findById(100L)).thenReturn(Optional.of(order));
        when(paymentRepo.findByOrderId(100L)).thenReturn(Optional.empty());
        when(paymentRepo.save(any(Payment.class))).thenAnswer(inv -> {
            Payment p = inv.getArgument(0);
            p.setId(50L);
            p.setPaymentId("PAY-ABC12345");
            return p;
        });
        when(orderRepo.save(order)).thenReturn(order);
        when(deliveryService.startDelivery(100L)).thenReturn(null);

        PaymentDTO result = paymentService.processPayment(dto);

        assertEquals(1210, result.getAmount());
        assertEquals("SUCCESS", result.getStatus());
        assertEquals("CONFIRMED", order.getStatus());
    }

    @Test
    void testProcessPayment_OrderNotFound() {
        PaymentDTO dto = new PaymentDTO();
        dto.setOrderId(999L);

        when(orderRepo.findById(999L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> paymentService.processPayment(dto));
    }

    @Test
    void testProcessPayment_AlreadyPaid() {
        PaymentDTO dto = new PaymentDTO();
        dto.setOrderId(100L);

        when(orderRepo.findById(100L)).thenReturn(Optional.of(order));
        when(paymentRepo.findByOrderId(100L)).thenReturn(Optional.of(payment));

        assertThrows(RuntimeException.class, () -> paymentService.processPayment(dto));
    }

    @Test
    void testGetPaymentByOrder_Success() {
        when(paymentRepo.findByOrderId(100L)).thenReturn(Optional.of(payment));

        PaymentDTO result = paymentService.getPaymentByOrder(100L);

        assertEquals(1210, result.getAmount());
        assertEquals("SUCCESS", result.getStatus());
    }

    @Test
    void testGenerateInvoice_Success() {
        when(orderRepo.findById(100L)).thenReturn(Optional.of(order));

        String invoice = paymentService.generateInvoice(100L);

        assertTrue(invoice.contains("Margherita x 2 = 600"));
        assertTrue(invoice.contains("Total: 1210.0"));
    }

    @Test
    void testGenerateInvoice_OrderNotFound() {
        when(orderRepo.findById(999L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> paymentService.generateInvoice(999L));
    }
}
