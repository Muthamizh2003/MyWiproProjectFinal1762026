package com.wipro.ecom.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.wipro.ecom.entities.DeliveryAgent;

public interface DeliveryAgentRepository extends JpaRepository<DeliveryAgent, Long> {
	
	
	@Query("SELECT a FROM DeliveryAgent a WHERE a.available = true")
	List<DeliveryAgent> findAvailableAgent();

	Optional<DeliveryAgent> findByPhone(String phone);

	Optional<DeliveryAgent> findByUserId(Long userId);
	
}