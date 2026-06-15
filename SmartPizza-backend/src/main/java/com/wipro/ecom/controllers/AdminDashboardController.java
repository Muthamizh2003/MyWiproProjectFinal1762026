package com.wipro.ecom.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wipro.ecom.dtos.CustomerAnalyticsDTO;
import com.wipro.ecom.dtos.CustomerTrendDTO;
import com.wipro.ecom.dtos.DailyOrderDTO;
import com.wipro.ecom.dtos.DeliveryAnalyticsDTO;
import com.wipro.ecom.dtos.HeatmapDTO;
import com.wipro.ecom.dtos.OrderAnalyticsDTO;
import com.wipro.ecom.dtos.RevenueDTO;
import com.wipro.ecom.services.AdminDashboardService;


@RestController
@RequestMapping("/admin/dashboard")
public class AdminDashboardController {

	@Autowired
    private AdminDashboardService dashboardService;

    //REVENUE
    @GetMapping("/revenue")
    public RevenueDTO getRevenue() {
        return dashboardService.getRevenueAnalytics();
    }

    //ORDER ANALYTICS
    @GetMapping("/orders")
    public OrderAnalyticsDTO getOrders() {
        return dashboardService.getOrderAnalytics();
    }

    //DELIVERY ANALYTICS
    @GetMapping("/delivery")
    public DeliveryAnalyticsDTO getDelivery() {
        return dashboardService.getDeliveryAnalytics();
    }

    //CUSTOMER ANALYTICS
    @GetMapping("/customers")
    public CustomerAnalyticsDTO getCustomers() {
        return dashboardService.getCustomerAnalytics();
    }
    
    @GetMapping("/heatmap")
    public List<HeatmapDTO> getHeatmap() {
        return dashboardService.getOrderHeatmap();
    }
    
    @GetMapping("/customer-trends")
    public List<CustomerTrendDTO> getCustomerTrends() {
        return dashboardService.getCustomerTrends();
    }

    @GetMapping("/daily-orders")
    public List<DailyOrderDTO> getDailyOrders() {
        return dashboardService.getDailyOrderCounts();
    }
}