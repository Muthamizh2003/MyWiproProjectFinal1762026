package com.wipro.ecom.services;

import java.util.List;

import com.wipro.ecom.dtos.DeliveryDTO;

public interface DeliveryService {

    DeliveryDTO startDelivery(Long orderId);

    DeliveryDTO trackDelivery(Long orderId);

    double calculateETA(Long orderId);

    List<DeliveryDTO> getAgentOrders(Long agentId);

    DeliveryDTO updateDeliveryStatus(Long deliveryId, String status);

    DeliveryDTO updateAgentLocation(Long deliveryId, double latitude, double longitude);
}
