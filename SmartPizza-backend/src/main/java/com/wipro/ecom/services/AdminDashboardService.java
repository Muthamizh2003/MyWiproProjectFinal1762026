package com.wipro.ecom.services;

import java.util.List;

import com.wipro.ecom.dtos.CustomerAnalyticsDTO;
import com.wipro.ecom.dtos.CustomerTrendDTO;
import com.wipro.ecom.dtos.DeliveryAnalyticsDTO;
import com.wipro.ecom.dtos.DeliveryPerformanceDTO;
import com.wipro.ecom.dtos.DailyOrderDTO;
import com.wipro.ecom.dtos.HeatmapDTO;
import com.wipro.ecom.dtos.OrderAnalyticsDTO;
import com.wipro.ecom.dtos.OrderDTO;
import com.wipro.ecom.dtos.ProductDTO;
import com.wipro.ecom.dtos.RevenueDTO;

public interface AdminDashboardService {

    RevenueDTO getRevenueAnalytics();

    OrderAnalyticsDTO getOrderAnalytics();

    DeliveryAnalyticsDTO getDeliveryAnalytics();
    
    List<HeatmapDTO> getOrderHeatmap();

    CustomerAnalyticsDTO getCustomerAnalytics();
    
    List<CustomerTrendDTO> getCustomerTrends();
    
    DeliveryPerformanceDTO getDeliveryPerformance();
    
    ProductDTO updateProduct(Long productId, ProductDTO dto);

    void deleteUser(Long userId);

    String blockUser(Long userId);

    OrderDTO updateOrderStatus(Long orderId, String status);

    List<OrderDTO> getAllOrders();

    List<DailyOrderDTO> getDailyOrderCounts();
}