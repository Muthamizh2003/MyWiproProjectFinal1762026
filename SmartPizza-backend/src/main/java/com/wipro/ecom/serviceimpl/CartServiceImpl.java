package com.wipro.ecom.serviceimpl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wipro.ecom.dtos.CartItemDTO;
import com.wipro.ecom.entities.CartItem;
import com.wipro.ecom.entities.Product;
import com.wipro.ecom.entities.User;
import com.wipro.ecom.repository.CartItemRepository;
import com.wipro.ecom.repository.ProductRepository;
import com.wipro.ecom.repository.UserRepository;
import com.wipro.ecom.services.CartService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.transaction.annotation.Transactional;

@Service
public class CartServiceImpl implements CartService {

	private static final Logger log = LoggerFactory.getLogger(CartServiceImpl.class);

	@Autowired
    private CartItemRepository cartRepo;
	
	@Autowired
    private ProductRepository productRepo;
	
	@Autowired
    private UserRepository userRepo; 

    //ADD TO CART
    @Override
    public void addToCart(Long userId, Long productId, int quantity) {
        log.info("Adding product {} to cart for user {}, quantity: {}", productId, userId, quantity);

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItem item = cartRepo
                .findByUser_IdAndProduct_Id(userId, productId)
                .orElse(null);

        if (item != null) {
            item.setQuantity(item.getQuantity() + quantity);
        } else {
            item = new CartItem();
            item.setUser(user);
            item.setProduct(product);
            item.setQuantity(quantity);
        }

        cartRepo.save(item);
    }

    //GET CART
    @Override
    public List<CartItemDTO> getCart(Long userId) {
        log.info("Fetching cart for user: {}", userId);

        List<CartItem> items = cartRepo.findByUserId(userId);

        List<CartItemDTO> response = new ArrayList<>();

        for (CartItem item : items) {

            Product p = item.getProduct();

            CartItemDTO dto = new CartItemDTO();
            dto.setId(item.getId());
            dto.setProductId(p.getId());
            dto.setProductName(p.getName());
            dto.setQuantity(item.getQuantity());
            dto.setPrice(p.getPrice());

            response.add(dto);
        }

        return response;
    }

    //UPDATE QUANTITY
    @Override
    public void updateQuantity(Long userId, Long productId, int quantity) {
        log.info("Updating quantity for user {}, product {} to {}", userId, productId, quantity);

        CartItem item = cartRepo
                .findByUser_IdAndProduct_Id(userId, productId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        if (quantity <= 0) {
            cartRepo.delete(item);
            log.info("Item removed from cart due to quantity <= 0");
        } else {
            item.setQuantity(quantity);
            cartRepo.save(item);
        }
    }

    //REMOVE ITEM
    @Override
    public void removeItem(Long userId, Long productId) {
        log.info("Removing product {} from cart for user {}", productId, userId);

        CartItem item = cartRepo
                .findByUser_IdAndProduct_Id(userId, productId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        cartRepo.delete(item);
    }

    //CLEAR CART
    @Override
    @Transactional
    public void clearCart(Long userId) {
        log.info("Clearing cart for user: {}", userId);
        cartRepo.deleteByUserId(userId);
    }
}