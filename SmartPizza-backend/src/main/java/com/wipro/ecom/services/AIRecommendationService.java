package com.wipro.ecom.services;

import java.util.List;

import com.wipro.ecom.dtos.AIRequestDTO;
import com.wipro.ecom.dtos.RecommendationDTO;

public interface AIRecommendationService {

    List<RecommendationDTO> getRecommendations(AIRequestDTO request);
}