package com.wipro.ecom.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import com.wipro.ecom.dtos.ComboDTO;
import com.wipro.ecom.dtos.ComboRequestDTO;
import com.wipro.ecom.services.ComboService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/combo")
public class ComboController {

	@Autowired
    private ComboService comboService;

    //AI SMART COMBO GENERATION
    @PostMapping("/smart")
    public List<ComboDTO> getSmartCombos(@Valid @RequestBody ComboRequestDTO request) {
        return comboService.getSmartCombos(request);
    }
}
