package com.wipro.ecom.controllers;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.wipro.ecom.dtos.DeliveryDTO;
import com.wipro.ecom.dtos.DeliveryLocationRequest;
import com.wipro.ecom.dtos.DeliveryStatusRequest;
import com.wipro.ecom.entities.DeliveryAgent;
import com.wipro.ecom.repository.DeliveryAgentRepository;
import com.wipro.ecom.securityservices.UserDetailsImp;
import com.wipro.ecom.services.DeliveryService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/delivery")
@RequiredArgsConstructor
public class DeliveryController {

    private static final Logger log = LoggerFactory.getLogger(DeliveryController.class);

    private final DeliveryService deliveryService;
    private final DeliveryAgentRepository agentRepo;

    //START DELIVERY(Assign agent + start tracking)
    @PostMapping("/start/{orderId}")
    public DeliveryDTO startDelivery(@PathVariable Long orderId) {
        log.info("Starting delivery for order: {}", orderId);
        return deliveryService.startDelivery(orderId);
    }

    //TRACK DELIVERY(Live simulation)
    @GetMapping("/track/{orderId}")
    public DeliveryDTO trackDelivery(@PathVariable Long orderId) {
        log.info("Tracking delivery for order: {}", orderId);
        return deliveryService.trackDelivery(orderId);
    }

    //GET ETA (Estimated time)
    @GetMapping("/eta/{orderId}")
    public double getETA(@PathVariable Long orderId) {
        log.info("Calculating ETA for order: {}", orderId);
        return deliveryService.calculateETA(orderId);
    }

    //DELIVERY AGENT ENDPOINTS (requires ROLE_DELIVERY)

    @GetMapping("/agent/orders")
    public List<DeliveryDTO> getMyOrders(Authentication auth) {
        DeliveryAgent agent = getAgent(auth);
        log.info("Fetching orders for agent: {}", agent.getId());
        return deliveryService.getAgentOrders(agent.getId());
    }

    @PutMapping("/agent/status")
    public DeliveryDTO updateStatus(@Valid @RequestBody DeliveryStatusRequest req, Authentication auth) {
        getAgent(auth);
        log.info("Updating delivery status: {} to {}", req.getDeliveryId(), req.getStatus());
        return deliveryService.updateDeliveryStatus(req.getDeliveryId(), req.getStatus());
    }

    @PutMapping("/agent/location")
    public DeliveryDTO updateLocation(@Valid @RequestBody DeliveryLocationRequest req, Authentication auth) {
        getAgent(auth);
        log.info("Updating location for delivery: {}", req.getDeliveryId());
        return deliveryService.updateAgentLocation(req.getDeliveryId(), req.getLatitude(), req.getLongitude());
    }

    private DeliveryAgent getAgent(Authentication auth) {
        String username = auth.getName();
        UserDetailsImp principal = (UserDetailsImp) auth.getPrincipal();
        return agentRepo.findByUserId(principal.getUserId())
                .orElseThrow(() -> new RuntimeException("Delivery agent not found for user: " + username));
    }
}