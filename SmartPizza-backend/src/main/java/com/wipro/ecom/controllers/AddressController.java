package com.wipro.ecom.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import com.wipro.ecom.dtos.AddressDTO;
import com.wipro.ecom.services.AddressService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/address")
public class AddressController {

	private static final Logger log = LoggerFactory.getLogger(AddressController.class);

	@Autowired
    private AddressService addressService;

    //ADD ADDRESS
    @PostMapping("/add/{userId}")
    public AddressDTO addAddress(@PathVariable Long userId,
                                 @Valid @RequestBody AddressDTO dto) {
        log.info("Adding address for user: {}", userId);
        return addressService.addAddress(userId, dto);
    }

    //GET ALL ADDRESSES FOR USER
    @GetMapping("/user/{userId}")
    public List<AddressDTO> getUserAddresses(@PathVariable Long userId) {
        log.info("Fetching addresses for user: {}", userId);
        return addressService.getUserAddresses(userId);
    }

    //GET ADDRESS BY ID
    @GetMapping("/{id}")
    public AddressDTO getAddressById(@PathVariable Long id) {
        log.info("Fetching address by id: {}", id);
        return addressService.getAddressById(id);
    }

    //UPDATE ADDRESS
    @PutMapping("/update/{id}")
    public AddressDTO updateAddress(@PathVariable Long id,
                                     @Valid @RequestBody AddressDTO dto) {
        log.info("Updating address: {}", id);
        return addressService.updateAddress(id, dto);
    }

    //DELETE ADDRESS
    @DeleteMapping("/delete/{id}")
    public String deleteAddress(@PathVariable Long id) {
        log.info("Deleting address: {}", id);
        addressService.deleteAddress(id);
        return "Address deleted successfully";
    }
}
