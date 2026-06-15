package com.wipro.ecom.dtos;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CustomerAnalyticsDTO {

    private List<Object[]> topCustomers;
}