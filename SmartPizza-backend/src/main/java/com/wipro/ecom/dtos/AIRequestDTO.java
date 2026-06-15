package com.wipro.ecom.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class AIRequestDTO {

    @NotBlank(message = "Prompt is required")
    private String prompt;

    private Long userId;
    private String season;
    private String category;
    private Double maxPrice;
}
