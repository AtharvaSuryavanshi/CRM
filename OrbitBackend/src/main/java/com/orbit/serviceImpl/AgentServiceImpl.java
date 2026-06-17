package com.orbit.serviceImpl;

import java.util.List;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.orbit.entity.Agent;
import com.orbit.repository.AgentRepository;
import com.orbit.service.AgentService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor

public class AgentServiceImpl implements AgentService {

    private final AgentRepository agentRepository;
    private final BCryptPasswordEncoder passwordEncoder; // 🔐 NEW

    @Override
    public Agent saveAgent(Agent agent) {

        // 🔐 Encrypt password before saving
        agent.setPassword(passwordEncoder.encode(agent.getPassword()));

        return agentRepository.save(agent);
    }

    @Override
    public List<Agent> getAllAgents() {
        return agentRepository.findAll();
    }

    @Override
    public Agent getAgentById(Long id) {
        return agentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agent not found")); // ✅ better
    }

    @Override
    public Agent updateAgent(Long id, Agent agent) {

        Agent existing = agentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        existing.setName(agent.getName());
        existing.setEmail(agent.getEmail());
        existing.setPhone(agent.getPhone());
        existing.setStatus(agent.getStatus());
        existing.setArea(agent.getArea());

        // 🔐 Optional: update password only if provided
        if (agent.getPassword() != null && !agent.getPassword().isEmpty()) {
            existing.setPassword(passwordEncoder.encode(agent.getPassword()));
        }

        return agentRepository.save(existing);
    }

    @Override
    public void deleteAgent(Long id) {

        if (!agentRepository.existsById(id)) {
            throw new RuntimeException("Agent not found");
        }

        agentRepository.deleteById(id);
    }

    @Override
    public List<Agent> getAgentsByManager(Long managerId) {
        return agentRepository.findByManagerId(managerId);
    }

    // 🔥 EXTRA (for login support)
    @Override
    public Agent getAgentByEmail(String email) {
        return agentRepository.findByEmail(email);
    }
}