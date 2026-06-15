package com.wipro.ecom.services;

import java.util.List;

import com.wipro.ecom.dtos.UserDTO;

public interface UserService {

    UserDTO register(UserDTO dto);

    UserDTO getUserById(Long id);

    List<UserDTO> getAllUsers();

    UserDTO updateUser(Long id, UserDTO dto);

    void deleteUser(Long id);
}