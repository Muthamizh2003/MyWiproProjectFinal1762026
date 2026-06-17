package com.wipro.ecom.serviceimpl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wipro.ecom.dtos.AddressDTO;
import com.wipro.ecom.dtos.OrderDTO;
import com.wipro.ecom.dtos.OrderItemDTO;
import com.wipro.ecom.entities.Address;
import com.wipro.ecom.entities.CartItem;
import com.wipro.ecom.entities.Coupon;
import com.wipro.ecom.entities.Order;
import com.wipro.ecom.entities.OrderItem;
import com.wipro.ecom.entities.Product;
import com.wipro.ecom.entities.User;
import com.wipro.ecom.enumpackage.DiscountType;
import com.wipro.ecom.entities.Delivery;
import com.wipro.ecom.repository.AddressRepository;
import com.wipro.ecom.repository.CartItemRepository;
import com.wipro.ecom.repository.CouponRepository;
import com.wipro.ecom.repository.DeliveryRepository;
import com.wipro.ecom.repository.OrderItemRepository;
import com.wipro.ecom.repository.OrderRepository;
import com.wipro.ecom.repository.ProductRepository;
import com.wipro.ecom.repository.UserRepository;
import com.wipro.ecom.services.OrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.transaction.Transactional;

@Service
public class OrderServiceImpl implements OrderService {

	private static final Logger log = LoggerFactory.getLogger(OrderServiceImpl.class);

	@Autowired
    private OrderRepository orderRepo;
	@Autowired
    private OrderItemRepository orderItemRepo;
	@Autowired
    private AddressRepository addressRepo;
	@Autowired
    private CartItemRepository cartRepo;
	@Autowired
    private DeliveryRepository deliveryRepo;
	@Autowired
    private ProductRepository productRepo;
	@Autowired
    private UserRepository userRepo;
	@Autowired
    private CouponRepository couponRepo;

	@Transactional
    //PLACE ORDER 
    @Override
    public OrderDTO placeOrder(Long userId, Long addressId, String couponCode) {
        log.info("Placing order for user: {}, address: {}, coupon: {}", userId, addressId, couponCode);

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (user.isBlocked()) {
            throw new RuntimeException("User is blocked");
        }

        Address address = addressRepo.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        List<CartItem> cartItems = cartRepo.findByUserId(userId);

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        double total = 0;
        List<OrderItem> orderItems = new ArrayList<>();

        // ✅ Convert cart → order items
        for (CartItem cart : cartItems) {

            Product p = cart.getProduct();

            OrderItem item = new OrderItem();
            item.setProduct(p);
            item.setQuantity(cart.getQuantity());
            item.setPrice(p.getPrice());
            item.setOrder(null); // set later

            total += p.getPrice() * cart.getQuantity();

            orderItems.add(item);
        }

        //APPLY COUPON
        if (couponCode != null) {

            Coupon coupon = couponRepo.findByCode(couponCode)
                    .orElseThrow(() -> new RuntimeException("Invalid coupon"));

            //expiry check
            if (coupon.getExpiryDate() != null &&
                coupon.getExpiryDate().isBefore(LocalDateTime.now())) {

                throw new RuntimeException("Coupon expired");
            }

            //minimum order check
            if (total < coupon.getMinOrderAmount()) {
                throw new RuntimeException("Minimum order not met");
            }

            double discount = 0;

            if (coupon.getType() == DiscountType.FLAT) {
                discount = coupon.getDiscount();
            } else {
                discount = (total * coupon.getDiscount()) / 100;
            }

            //prevent negative
            discount = Math.min(discount, total);

            total -= discount;
        }


        //TAX(example 10%)
		double tax = Math.max(total * 0.1, 0);
		double finalAmount = Math.max(total + tax, 0);


        //CREATE ORDER
        Order order = new Order();
        order.setUser(user);
        order.setDeliveryAddress(address);
        order.setStatus("PENDING_PAYMENT");
        order.setTaxAmount(tax);
        order.setTotalAmount(finalAmount);

        order = orderRepo.save(order);

        //Save items
        for (OrderItem item : orderItems) {
            item.setOrder(order);
        }

        orderItemRepo.saveAll(orderItems);

        //Clear cart
        cartRepo.deleteByUserId(userId);

        //Return DTO
        log.info("Order placed successfully: {} for user: {}", order.getId(), userId);
        return mapToDTO(order, orderItems);
    }

    //GET USER ORDERS
    @Override
    public List<OrderDTO> getUserOrders(Long userId) {
        log.info("Fetching orders for user: {}", userId);
        return orderRepo.findByUserId(userId)
                .stream()
                .map(o -> mapToDTO(o, o.getItems()))
                .toList();
    }

    //NAMED QUERY
    @Override
    public List<OrderDTO> getOrdersByStatus(String status) {
        log.info("Fetching orders by status: {}", status);
        return orderRepo.getOrdersByStatus(status)
                .stream()
                .map(o -> mapToDTO(o, o.getItems()))
                .toList();
    }

    //HQL
    @Override
    public List<OrderDTO> getHighValueOrders(double amount) {
        log.info("Fetching high value orders above: {}", amount);
        return orderRepo.findHighValueOrders(amount)
                .stream()
                .map(o -> mapToDTO(o, o.getItems()))
                .toList();
    }

    //NATIVE
    @Override
    public List<OrderDTO> getTopOrders() {
        log.info("Fetching top orders");
        return orderRepo.getTopOrders()
                .stream()
                .map(o -> mapToDTO(o, o.getItems()))
                .toList();
    }

    //MAPPER
    private OrderDTO mapToDTO(Order order, List<OrderItem> items) {

        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setUserId(order.getUser().getId());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setTaxAmount(order.getTaxAmount());
        dto.setStatus(order.getStatus());
        dto.setCreatedAt(order.getCreatedAt());
        //MAP ADDRESS
        if (order.getDeliveryAddress() != null) {

            Address a = order.getDeliveryAddress();

            AddressDTO addressDTO = new AddressDTO();
            addressDTO.setId(a.getId());
            addressDTO.setStreet(a.getStreet());
            addressDTO.setCity(a.getCity());
            addressDTO.setState(a.getState());
            addressDTO.setPincode(a.getPincode());
            addressDTO.setLandmark(a.getLandmark());
            addressDTO.setLatitude(a.getLatitude());
            addressDTO.setLongitude(a.getLongitude());

            dto.setDeliveryAddress(addressDTO); 
        }
        List<OrderItemDTO> itemDTOs = items.stream().map(i -> {

            OrderItemDTO d = new OrderItemDTO();
            d.setProductId(i.getProduct().getId());
            d.setProductName(i.getProduct().getName());
            d.setQuantity(i.getQuantity());
            d.setPrice(i.getPrice());

            return d;

        }).toList();

        dto.setItems(itemDTOs);

        deliveryRepo.findByOrderId(order.getId()).ifPresent(delivery -> {
            dto.setDeliveryAgentName(delivery.getAgent().getName());
            dto.setDeliveryStatus(delivery.getStatus());
        });

        return dto;
    }
    
    @Override
    public void cancelOrder(Long orderId) {
        log.info("Cancelling order: {}", orderId);

        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        //only allow cancel for valid statuses
        if (!order.getStatus().equalsIgnoreCase("PENDING_PAYMENT") &&
        	!order.getStatus().equalsIgnoreCase("CONFIRMED")) {

        	log.warn("Order {} cannot be cancelled at current status: {}", orderId, order.getStatus());
        	 throw new RuntimeException("Order cannot be cancelled at this stage");
        }

        order.setStatus("CANCELLED");

        orderRepo.save(order);
        log.info("Order cancelled: {}", orderId);
    }

}
