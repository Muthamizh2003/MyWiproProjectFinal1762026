package com.wipro.ecom.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class DailyOrderDTO {
    private String date;
    private long count;
}
