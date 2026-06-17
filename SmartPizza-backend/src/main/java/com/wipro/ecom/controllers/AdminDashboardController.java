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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@RestController
@RequestMapping("/admin/dashboard")
public class AdminDashboardController {

    private static final Logger log = LoggerFactory.getLogger(AdminDashboardController.class);

	@Autowired
    private AdminDashboardService dashboardService;

    //REVENUE
    @GetMapping("/revenue")
    public RevenueDTO getRevenue() {
        log.info("Fetching revenue analytics");
        return dashboardService.getRevenueAnalytics();
    }

    //ORDER ANALYTICS
    @GetMapping("/orders")
    public OrderAnalyticsDTO getOrders() {
        log.info("Fetching order analytics");
        return dashboardService.getOrderAnalytics();
    }

    //DELIVERY ANALYTICS
    @GetMapping("/delivery")
    public DeliveryAnalyticsDTO getDelivery() {
        log.info("Fetching delivery analytics");
        return dashboardService.getDeliveryAnalytics();
    }

    //CUSTOMER ANALYTICS
    @GetMapping("/customers")
    public CustomerAnalyticsDTO getCustomers() {
        log.info("Fetching customer analytics");
        return dashboardService.getCustomerAnalytics();
    }
    
    @GetMapping("/heatmap")
    public List<HeatmapDTO> getHeatmap() {
        log.info("Fetching order heatmap");
        return dashboardService.getOrderHeatmap();
    }
    
    @GetMapping("/customer-trends")
    public List<CustomerTrendDTO> getCustomerTrends() {
        log.info("Fetching customer trends");
        return dashboardService.getCustomerTrends();
    }

    @GetMapping("/daily-orders")
    public List<DailyOrderDTO> getDailyOrders() {
        log.info("Fetching daily order counts");
        return dashboardService.getDailyOrderCounts();
    }
}