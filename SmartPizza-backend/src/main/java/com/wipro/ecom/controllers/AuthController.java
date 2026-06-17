package com.wipro.ecom.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import com.wipro.ecom.dtos.AuthRequestDTO;
import com.wipro.ecom.dtos.AuthResponseDTO;
import com.wipro.ecom.securityservices.UserDetailsImp;
import com.wipro.ecom.services.JwtService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private JwtService jwtService;

    //LOGIN API
    @PostMapping("/login")
    public AuthResponseDTO login(@Valid @RequestBody AuthRequestDTO request) {

        log.info("Login attempt for user: {}", request.getUsername());

        //Authenticate user
        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        //If success → generate token
        UserDetailsImp userDetails = (UserDetailsImp) authentication.getPrincipal();

        //Extract role
        String role = userDetails.getAuthorities()
                .stream()
                .findFirst()
                .get()
                .getAuthority();

        String token = jwtService.generateToken(userDetails.getUsername(), role, userDetails.getUserId());

        log.info("Login successful for user: {}", request.getUsername());
        return new AuthResponseDTO(token);
    }
}
