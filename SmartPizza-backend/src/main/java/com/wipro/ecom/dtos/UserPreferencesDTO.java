package com.wipro.ecom.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UserPreferencesDTO {

    private Long userId;
    private String favoriteCategory;
    private String favoriteSize;
}