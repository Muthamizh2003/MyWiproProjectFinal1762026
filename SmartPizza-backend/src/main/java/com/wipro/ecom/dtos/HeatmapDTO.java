package com.wipro.ecom.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HeatmapDTO {

    private String location;
    private Long orderCount;
}