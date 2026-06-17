package com.wipro.ecom.serviceimpl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wipro.ecom.dtos.DeliveryDTO;
import com.wipro.ecom.entities.Address;
import com.wipro.ecom.entities.Delivery;
import com.wipro.ecom.entities.DeliveryAgent;
import com.wipro.ecom.entities.Order;
import com.wipro.ecom.external.AzureMapsService;
import com.wipro.ecom.repository.DeliveryAgentRepository;
import com.wipro.ecom.repository.DeliveryRepository;
import com.wipro.ecom.repository.OrderRepository;
import com.wipro.ecom.services.DeliveryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Service
public class DeliveryServiceImpl implements DeliveryService {

	private static final Logger log = LoggerFactory.getLogger(DeliveryServiceImpl.class);

	@Autowired
    private DeliveryRepository deliveryRepo;
	@Autowired
    private OrderRepository orderRepo;
	@Autowired
    private DeliveryAgentRepository agentRepo;

	@Autowired
	private AzureMapsService mapsService;

    private static final double SHOP_LAT = 13.0827;
    private static final double SHOP_LNG = 80.2707;

    //START DELIVERY
    @Override
    public DeliveryDTO startDelivery(Long orderId) {
        log.info("Starting delivery for order: {}", orderId);

		if (deliveryRepo.findByOrderId(orderId).isPresent()) {
		    log.warn("Delivery already started for order: {}", orderId);
		    throw new RuntimeException("Delivery already started");
		}

        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));


	     //GET ALL AVAILABLE AGENTS
	     List<DeliveryAgent> agents = agentRepo.findAvailableAgent();
	
	     //CHECK EMPTY
	     if (agents.isEmpty()) {
	         log.warn("No delivery agents available for order: {}", orderId);
	         throw new RuntimeException("No agent available");
	     }
	
	     //PICK FIRST AGENT
	     DeliveryAgent agent = agents.get(0);

        

		agent.setAvailable(false);
		agentRepo.save(agent);

       
        Delivery delivery = new Delivery();
        delivery.setOrder(order);
        delivery.setAgent(agent);
        delivery.setStatus("OUT_FOR_DELIVERY");

        // ✅ Start from shop location
        delivery.setLatitude(SHOP_LAT);
        delivery.setLongitude(SHOP_LNG);

        delivery = deliveryRepo.save(delivery);

        log.info("Delivery started for order: {} with agent: {}", orderId, agent.getName());
        return mapToDTO(delivery);
    }

    //LIVE TRACKING (SIMULATION)
    @Override
    public DeliveryDTO trackDelivery(Long orderId) {
        log.info("Tracking delivery for order: {}", orderId);

        Delivery delivery = deliveryRepo.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Delivery not found"));

        Address address = delivery.getOrder().getDeliveryAddress();

        double userLat = address.getLatitude();
        double userLng = address.getLongitude();

        //simulate movement (small step)
        double newLat = moveTowards(delivery.getLatitude(), userLat);
        double newLng = moveTowards(delivery.getLongitude(), userLng);

        delivery.setLatitude(newLat);
        delivery.setLongitude(newLng);
        
        //reached
        if (Math.abs(newLat - userLat) < 0.001 &&
        	    Math.abs(newLng - userLng) < 0.001) {

        	    delivery.setStatus("DELIVERED");
        	    delivery.setDeliveryTime(15.0); 
        	    Order order = delivery.getOrder();
        	    order.setStatus("DELIVERED");
        	    orderRepo.save(order);

        	    DeliveryAgent agent = delivery.getAgent();
        	    agent.setAvailable(true);
        	    agentRepo.save(agent);

        	    log.info("Delivery completed for order: {}", orderId);
        	}

        delivery = deliveryRepo.save(delivery);

        return mapToDTO(delivery);
    }

    //ETA CALCULATION
    @Override
    public double calculateETA(Long orderId) {
        log.info("Calculating ETA for order: {}", orderId);

        Delivery delivery = deliveryRepo.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Delivery not found"));

        double deliveryLat = delivery.getLatitude();
        double deliveryLng = delivery.getLongitude();

        Address address = delivery.getOrder().getDeliveryAddress();

        double userLat = address.getLatitude();
        double userLng = address.getLongitude();
       
        return mapsService.getETA(deliveryLat, deliveryLng, userLat, userLng);
    }
    
    //GET ALL DELIVERIES FOR AN AGENT
    @Override
    public List<DeliveryDTO> getAgentOrders(Long agentId) {
        log.info("Fetching orders for agent: {}", agentId);
        return deliveryRepo.findByAgentId(agentId).stream()
                .map(this::mapToDTO)
                .toList();
    }

    //UPDATE DELIVERY STATUS
    @Override
    public DeliveryDTO updateDeliveryStatus(Long deliveryId, String status) {
        log.info("Updating delivery {} status to: {}", deliveryId, status);
        Delivery delivery = deliveryRepo.findById(deliveryId)
                .orElseThrow(() -> new RuntimeException("Delivery not found"));

        delivery.setStatus(status);

        if ("DELIVERED".equalsIgnoreCase(status)) {
            Order order = delivery.getOrder();
            order.setStatus("DELIVERED");
            orderRepo.save(order);

            DeliveryAgent agent = delivery.getAgent();
            agent.setAvailable(true);
            agentRepo.save(agent);
            log.info("Delivery {} marked as DELIVERED", deliveryId);
        }

        delivery = deliveryRepo.save(delivery);
        return mapToDTO(delivery);
    }

    //UPDATE AGENT GPS LOCATION
    @Override
    public DeliveryDTO updateAgentLocation(Long deliveryId, double latitude, double longitude) {
        log.debug("Updating agent location for delivery: {} to ({}, {})", deliveryId, latitude, longitude);
        Delivery delivery = deliveryRepo.findById(deliveryId)
                .orElseThrow(() -> new RuntimeException("Delivery not found"));

        delivery.setLatitude(latitude);
        delivery.setLongitude(longitude);

        delivery = deliveryRepo.save(delivery);
        return mapToDTO(delivery);
    }

    //HELPER: MOVE STEP
    private double moveTowards(double current, double target) {
        return current + (target - current) * 0.1;
    }

    

    //DTO MAPPING
    private DeliveryDTO mapToDTO(Delivery d) {

        DeliveryDTO dto = new DeliveryDTO();

        dto.setId(d.getId());
        dto.setOrderId(d.getOrder().getId());
        dto.setStatus(d.getStatus());
        dto.setLatitude(d.getLatitude());
        dto.setLongitude(d.getLongitude());
        dto.setAgentName(d.getAgent().getName());
        dto.setCustomerLatitude(d.getOrder().getDeliveryAddress().getLatitude());
        dto.setCustomerLongitude(d.getOrder().getDeliveryAddress().getLongitude());
        dto.setEta(
        	    mapsService.getETA(
        	        d.getLatitude(),
        	        d.getLongitude(),
        	        d.getOrder().getDeliveryAddress().getLatitude(),
        	        d.getOrder().getDeliveryAddress().getLongitude()
        	    )
        	);
        return dto;
    }
}