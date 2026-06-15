package com.wipro.ecom.services;

import java.util.List;

import com.wipro.ecom.dtos.AddressDTO;

public interface AddressService {

    AddressDTO addAddress(Long userId, AddressDTO dto);

    List<AddressDTO> getUserAddresses(Long userId);

    AddressDTO getAddressById(Long id);

    AddressDTO updateAddress(Long id, AddressDTO dto);

    void deleteAddress(Long id);
}