package com.wipro.ecom.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import com.wipro.ecom.dtos.UserDTO;
import com.wipro.ecom.services.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/users")
public class UserController {

	@Autowired
    private UserService userService;

    //REGISTER USER
    @PostMapping("/register")
    public UserDTO register(@Valid @RequestBody UserDTO dto) {
        return userService.register(dto);
    }

    //GET USER BY ID
    @GetMapping("/{id}")
    public UserDTO getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    //GET ALL USERS (ADMIN USE)
    @GetMapping("/all")
    public List<UserDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    //UPDATE USER
    @PutMapping("/{id}")
    public UserDTO updateUser(@PathVariable Long id,
                              @Valid @RequestBody UserDTO dto) {
        return userService.updateUser(id, dto);
    }

    //DELETE USER
    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return "User deleted successfully";
    }
}