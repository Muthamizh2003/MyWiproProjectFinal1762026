package com.wipro.ecom.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ComboRequestDTO {

    @NotBlank(message = "Prompt is required")
    private String prompt;

    private String category;
}