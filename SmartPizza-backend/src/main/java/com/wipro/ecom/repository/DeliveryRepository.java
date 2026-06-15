package com.wipro.ecom.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.wipro.ecom.entities.Delivery;

public interface DeliveryRepository extends JpaRepository<Delivery, Long> {

    Optional<Delivery> findByOrderId(Long orderId);
    
    List<Delivery> findByAgentId(Long agentId);
    
    @Query("SELECT d.status, COUNT(d) FROM Delivery d GROUP BY d.status")
    List<Object[]> getDeliveryStats();
    

	@Query("SELECT AVG(d.deliveryTime) FROM Delivery d WHERE d.status = 'DELIVERED'")
	Double getAverageDeliveryTime();

}
