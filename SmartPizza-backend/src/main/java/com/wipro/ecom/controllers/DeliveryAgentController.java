package com.wipro.ecom.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import com.wipro.ecom.entities.DeliveryAgent;
import com.wipro.ecom.repository.DeliveryAgentRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin/agent")
@RequiredArgsConstructor
public class DeliveryAgentController {

    private final DeliveryAgentRepository agentRepo;

    //ADD AGENT
    @PostMapping("/add")
    public DeliveryAgent addAgent(@Valid @RequestBody DeliveryAgent agent) {
        agent.setAvailable(true);
        return agentRepo.save(agent);
    }

    //GET ALL AGENTS
    @GetMapping
    public List<DeliveryAgent> getAllAgents() {
        return agentRepo.findAll();
    }
}
