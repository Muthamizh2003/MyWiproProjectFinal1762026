package com.wipro.ecom.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import com.wipro.ecom.dtos.AddressDTO;
import com.wipro.ecom.services.AddressService;

@RestController
@RequestMapping("/address")
public class AddressController {

	@Autowired
    private AddressService addressService;

    //ADD ADDRESS
    @PostMapping("/add/{userId}")
    public AddressDTO addAddress(@PathVariable Long userId,
                                 @Valid @RequestBody AddressDTO dto) {
        return addressService.addAddress(userId, dto);
    }

    //GET ALL ADDRESSES FOR USER
    @GetMapping("/user/{userId}")
    public List<AddressDTO> getUserAddresses(@PathVariable Long userId) {
        return addressService.getUserAddresses(userId);
    }

    //GET ADDRESS BY ID
    @GetMapping("/{id}")
    public AddressDTO getAddressById(@PathVariable Long id) {
        return addressService.getAddressById(id);
    }

    //UPDATE ADDRESS
    @PutMapping("/update/{id}")
    public AddressDTO updateAddress(@PathVariable Long id,
                                     @Valid @RequestBody AddressDTO dto) {
        return addressService.updateAddress(id, dto);
    }

    //DELETE ADDRESS
    @DeleteMapping("/delete/{id}")
    public String deleteAddress(@PathVariable Long id) {
        addressService.deleteAddress(id);
        return "Address deleted successfully";
    }
}
