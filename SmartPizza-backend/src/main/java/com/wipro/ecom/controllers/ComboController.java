package com.wipro.ecom.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import com.wipro.ecom.dtos.ComboDTO;
import com.wipro.ecom.dtos.ComboRequestDTO;
import com.wipro.ecom.services.ComboService;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/combo")
public class ComboController {

    private static final Logger log = LoggerFactory.getLogger(ComboController.class);

	@Autowired
    private ComboService comboService;

    //AI SMART COMBO GENERATION
    @PostMapping("/smart")
    public List<ComboDTO> getSmartCombos(@Valid @RequestBody ComboRequestDTO request) {
        log.info("Generating smart combos with prompt: {}", request.getPrompt());
        return comboService.getSmartCombos(request);
    }
}
