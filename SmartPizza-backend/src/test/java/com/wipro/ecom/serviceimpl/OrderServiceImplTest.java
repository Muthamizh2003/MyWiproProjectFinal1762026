package com.wipro.ecom.serviceimpl;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.wipro.ecom.dtos.OrderDTO;
import com.wipro.ecom.entities.Address;
import com.wipro.ecom.entities.CartItem;
import com.wipro.ecom.entities.Coupon;
import com.wipro.ecom.entities.Order;
import com.wipro.ecom.entities.Product;
import com.wipro.ecom.entities.User;
import com.wipro.ecom.enumpackage.DiscountType;
import com.wipro.ecom.repository.AddressRepository;
import com.wipro.ecom.repository.CartItemRepository;
import com.wipro.ecom.repository.CouponRepository;
import com.wipro.ecom.repository.OrderItemRepository;
import com.wipro.ecom.repository.OrderRepository;
import com.wipro.ecom.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class OrderServiceImplTest {

    @Mock
    private OrderRepository orderRepo;
    @Mock
    private OrderItemRepository orderItemRepo;
    @Mock
    private CartItemRepository cartRepo;
    @Mock
    private UserRepository userRepo;
    @Mock
    private AddressRepository addressRepo;
    @Mock
    private CouponRepository couponRepo;

    @InjectMocks
    private OrderServiceImpl orderService;

    private User user;
    private Address address;
    private CartItem cartItem;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setName("Test User");
        user.setBlocked(false);

        address = new Address();
        address.setId(10L);
        address.setCity("Mumbai");
        address.setState("Maharashtra");

        Product product = new Product();
        product.setId(100L);
        product.setName("Margherita");
        product.setPrice(300);

        cartItem = new CartItem();
        cartItem.setUser(user);
        cartItem.setProduct(product);
        cartItem.setQuantity(2);
    }

    @Test
    void testPlaceOrder_Success() {
        when(userRepo.findById(1L)).thenReturn(Optional.of(user));
        when(addressRepo.findById(10L)).thenReturn(Optional.of(address));
        when(cartRepo.findByUserId(1L)).thenReturn(List.of(cartItem));

        when(orderRepo.save(any(Order.class))).thenAnswer(inv -> {
            Order o = inv.getArgument(0);
            o.setId(1000L);
            o.setCreatedAt(LocalDateTime.now());
            return o;
        });
        when(orderItemRepo.saveAll(anyList())).thenAnswer(inv -> inv.getArgument(0));

        OrderDTO result = orderService.placeOrder(1L, 10L, null);

        assertEquals("PENDING_PAYMENT", result.getStatus());
        assertEquals(660, result.getTotalAmount()); // 600 + 60 tax
        assertEquals(60, result.getTaxAmount());
        verify(cartRepo).deleteByUserId(1L);
    }

    @Test
    void testPlaceOrder_WithCoupon() {
        Coupon coupon = new Coupon();
        coupon.setCode("PCT10");
        coupon.setDiscount(10);
        coupon.setType(DiscountType.PERCENTAGE);
        coupon.setMinOrderAmount(100);
        coupon.setExpiryDate(LocalDateTime.now().plusDays(30));

        when(userRepo.findById(1L)).thenReturn(Optional.of(user));
        when(addressRepo.findById(10L)).thenReturn(Optional.of(address));
        when(cartRepo.findByUserId(1L)).thenReturn(List.of(cartItem));
        when(couponRepo.findByCode("PCT10")).thenReturn(Optional.of(coupon));
        when(orderRepo.save(any(Order.class))).thenAnswer(inv -> {
            Order o = inv.getArgument(0);
            o.setId(1001L);
            o.setCreatedAt(LocalDateTime.now());
            return o;
        });
        when(orderItemRepo.saveAll(anyList())).thenAnswer(inv -> inv.getArgument(0));

        OrderDTO result = orderService.placeOrder(1L, 10L, "PCT10");

        // subtotal=600, discount=60, totalAfterDiscount=540, tax=54, final=594
        assertEquals(594, result.getTotalAmount());
        assertEquals(54, result.getTaxAmount());
    }

    @Test
    void testPlaceOrder_BlockedUser() {
        user.setBlocked(true);
        when(userRepo.findById(1L)).thenReturn(Optional.of(user));

        assertThrows(RuntimeException.class, () -> orderService.placeOrder(1L, 10L, null));
    }

    @Test
    void testPlaceOrder_EmptyCart() {
        when(userRepo.findById(1L)).thenReturn(Optional.of(user));
        when(addressRepo.findById(10L)).thenReturn(Optional.of(address));
        when(cartRepo.findByUserId(1L)).thenReturn(new ArrayList<>());

        assertThrows(RuntimeException.class, () -> orderService.placeOrder(1L, 10L, null));
    }

    @Test
    void testCancelOrder_Success() {
        Order order = new Order();
        order.setId(1L);
        order.setStatus("PENDING_PAYMENT");

        when(orderRepo.findById(1L)).thenReturn(Optional.of(order));
        when(orderRepo.save(order)).thenReturn(order);

        orderService.cancelOrder(1L);

        assertEquals("CANCELLED", order.getStatus());
    }

    @Test
    void testCancelOrder_InvalidStatus() {
        Order order = new Order();
        order.setId(2L);
        order.setStatus("DELIVERED");

        when(orderRepo.findById(2L)).thenReturn(Optional.of(order));

        assertThrows(RuntimeException.class, () -> orderService.cancelOrder(2L));
    }
}
