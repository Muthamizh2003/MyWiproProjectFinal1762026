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

@RestController
@RequestMapping("/admin")
public class AdminController {

	@Autowired
    private AdminDashboardService adminService;

    //UPDATE PRODUCT
    @PutMapping("/product/{id}")
    public ProductDTO updateProduct(@PathVariable Long id,
                                    @Valid @RequestBody ProductDTO dto) {
        return adminService.updateProduct(id, dto);
    }

    //DELETE USER
    @DeleteMapping("/user/{id}")
    public String deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return "User deleted successfully";
    }

    //BLOCK USER
    @PutMapping("/user/block/{id}")
    public String blockUser(@PathVariable Long id) {
        return adminService.blockUser(id);
    }

    //GET ALL ORDERS
    @GetMapping("/orders/all")
    public List<OrderDTO> getAllOrders() {
        return adminService.getAllOrders();
    }

    //UPDATE ORDER STATUS
    @PutMapping("/order/{id}")
    public OrderDTO updateOrderStatus(@PathVariable Long id,
                                      @RequestParam String status) {
        return adminService.updateOrderStatus(id, status);
    }
    
    @Autowired
    private AddressService addressService;

    //ADMIN UPDATE ADDRESS
    @PutMapping("/address/{id}")
    public AddressDTO updateAddress(@PathVariable Long id,
                                     @Valid @RequestBody AddressDTO dto) {
        return addressService.updateAddress(id, dto);
    }

    //ADMIN DELETE ADDRESS
    @DeleteMapping("/address/{id}")
    public String deleteAddress(@PathVariable Long id) {
        addressService.deleteAddress(id);
        return "Address deleted by admin";
    }
}