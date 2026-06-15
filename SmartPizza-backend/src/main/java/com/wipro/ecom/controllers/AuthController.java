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

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private JwtService jwtService;

    //LOGIN API
    @PostMapping("/login")
    public AuthResponseDTO login(@Valid @RequestBody AuthRequestDTO request) {

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

        return new AuthResponseDTO(token);
    }
}
