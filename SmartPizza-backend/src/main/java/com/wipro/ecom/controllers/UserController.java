package com.wipro.ecom.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import com.wipro.ecom.dtos.UserDTO;
import com.wipro.ecom.services.UserService;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/users")
public class UserController {

	private static final Logger log = LoggerFactory.getLogger(UserController.class);

	@Autowired
    private UserService userService;

    //REGISTER USER
    @PostMapping("/register")
    public UserDTO register(@Valid @RequestBody UserDTO dto) {
        log.info("Registering user: {}", dto.getEmail());
        return userService.register(dto);
    }

    //GET USER BY ID
    @GetMapping("/{id}")
    public UserDTO getUserById(@PathVariable Long id) {
        log.info("Fetching user by id: {}", id);
        return userService.getUserById(id);
    }

    //GET ALL USERS (ADMIN USE)
    @GetMapping("/all")
    public List<UserDTO> getAllUsers() {
        log.info("Fetching all users");
        return userService.getAllUsers();
    }

    //UPDATE USER
    @PutMapping("/{id}")
    public UserDTO updateUser(@PathVariable Long id,
                              @Valid @RequestBody UserDTO dto) {
        log.info("Updating user: {}", id);
        return userService.updateUser(id, dto);
    }

    //DELETE USER
    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Long id) {
        log.info("Deleting user: {}", id);
        userService.deleteUser(id);
        return "User deleted successfully";
    }
}