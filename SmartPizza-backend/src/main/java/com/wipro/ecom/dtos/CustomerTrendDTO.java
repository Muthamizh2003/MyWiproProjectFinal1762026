package com.wipro.ecom.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CustomerTrendDTO {

    private String date;
    private Long activeUsers;
}