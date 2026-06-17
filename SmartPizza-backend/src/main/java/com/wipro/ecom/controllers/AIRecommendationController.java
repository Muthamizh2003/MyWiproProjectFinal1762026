package com.wipro.ecom.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import com.wipro.ecom.dtos.AIRequestDTO;
import com.wipro.ecom.dtos.RecommendationDTO;
import com.wipro.ecom.services.AIRecommendationService;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/ai")
public class AIRecommendationController {

    private static final Logger log = LoggerFactory.getLogger(AIRecommendationController.class);

	@Autowired
    private AIRecommendationService aiService;

    //RECOMMENDATION API
    @PostMapping("/recommend")
    public List<RecommendationDTO> getRecommendations(
            @Valid @RequestBody AIRequestDTO request) {

        log.info("Fetching AI recommendations for prompt: {}", request.getPrompt());
        return aiService.getRecommendations(request);
    }
}