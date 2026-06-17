package com.wipro.ecom.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import com.wipro.ecom.dtos.ProductDTO;
import com.wipro.ecom.dtos.OrderDTO;
import com.wipro.ecom.services.AdminDashboardService;
import com.wipro.ecom.dtos.AddressDTO;
import com.wipro.ecom.services.AddressService;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private static final Logger log = LoggerFactory.getLogger(AdminController.class);

	@Autowired
    private AdminDashboardService adminService;

    //UPDATE PRODUCT
    @PutMapping("/product/{id}")
    public ProductDTO updateProduct(@PathVariable Long id,
                                    @Valid @RequestBody ProductDTO dto) {
        log.info("Admin updating product: {}", id);
        return adminService.updateProduct(id, dto);
    }

    //DELETE USER
    @DeleteMapping("/user/{id}")
    public String deleteUser(@PathVariable Long id) {
        log.info("Admin deleting user: {}", id);
        adminService.deleteUser(id);
        return "User deleted successfully";
    }

    //BLOCK USER
    @PutMapping("/user/block/{id}")
    public String blockUser(@PathVariable Long id) {
        log.info("Admin blocking user: {}", id);
        return adminService.blockUser(id);
    }

    //GET ALL ORDERS
    @GetMapping("/orders/all")
    public List<OrderDTO> getAllOrders() {
        log.info("Admin fetching all orders");
        return adminService.getAllOrders();
    }

    //UPDATE ORDER STATUS
    @PutMapping("/order/{id}")
    public OrderDTO updateOrderStatus(@PathVariable Long id,
                                      @RequestParam String status) {
        log.info("Admin updating order {} status to: {}", id, status);
        return adminService.updateOrderStatus(id, status);
    }
    
    @Autowired
    private AddressService addressService;

    //ADMIN UPDATE ADDRESS
    @PutMapping("/address/{id}")
    public AddressDTO updateAddress(@PathVariable Long id,
                                     @Valid @RequestBody AddressDTO dto) {
        log.info("Admin updating address: {}", id);
        return addressService.updateAddress(id, dto);
    }

    //ADMIN DELETE ADDRESS
    @DeleteMapping("/address/{id}")
    public String deleteAddress(@PathVariable Long id) {
        log.info("Admin deleting address: {}", id);
        addressService.deleteAddress(id);
        return "Address deleted by admin";
    }
}