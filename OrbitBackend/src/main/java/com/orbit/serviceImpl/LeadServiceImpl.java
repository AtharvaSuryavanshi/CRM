package com.orbit.serviceImpl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.orbit.entity.Agent;
import com.orbit.entity.Lead;
import com.orbit.enums.LeadStatus;
import com.orbit.repository.AgentRepository;
import com.orbit.repository.LeadRepository;
import com.orbit.service.LeadService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LeadServiceImpl implements LeadService {

    private final LeadRepository leadRepository;
    private final AgentRepository agentRepository;

    // ✅ CREATE LEAD (FIXED)
    @Override
    public Lead saveLead(Lead lead) {

        // 🔥 Handle agent properly
        if (lead.getAgent() != null && lead.getAgent().getId() != null) {

            Agent agent = agentRepository.findById(lead.getAgent().getId())
                    .orElseThrow(() -> new RuntimeException("Agent not found"));

            lead.setAgent(agent);
        } else {
            lead.setAgent(null); // safe
        }

        // ✅ Auto set created date
        if (lead.getCreatedAt() == null) {
            lead.setCreatedAt(LocalDateTime.now());
        }

        return leadRepository.save(lead);
    }

    // ✅ GET ALL
    @Override
    public List<Lead> getAllLeads() {
        return leadRepository.findAll();
    }

    // ✅ GET BY ID
    @Override
    public Lead getLeadById(Long id) {
        return leadRepository.findById(id).orElse(null);
    }

    // ✅ UPDATE
    @Override
    public Lead updateLead(Long id, Lead lead) {
        Lead existing = leadRepository.findById(id).orElse(null);

        if (existing != null) {
            existing.setName(lead.getName());
            existing.setEmail(lead.getEmail());
            existing.setPhone(lead.getPhone());
            existing.setStatus(lead.getStatus());
            existing.setSource(lead.getSource());
            existing.setNotes(lead.getNotes());
            existing.setPriority(lead.getPriority());

            return leadRepository.save(existing);
        }

        return null;
    }

    // ✅ DELETE
    @Override
    public void deleteLead(Long id) {
        leadRepository.deleteById(id);
    }

    // 🔥 FIXED ENUM ISSUE (IMPORTANT)
    @Override
    public List<Lead> getLeadsByStatus(String status) {
        return leadRepository.findByStatus(
                LeadStatus.valueOf(status.toUpperCase())
        );
    }

    // ✅ GET BY AGENT
    @Override
    public List<Lead> getLeadsByAgent(Long agentId) {
        return leadRepository.findByAgentId(agentId);
    }

    // 🔥 ASSIGN LEAD → AGENT
    @Override
    public void assignLeadToAgent(Long leadId, Long agentId) {

        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new RuntimeException("Lead not found"));

        Agent agent = agentRepository.findById(agentId)
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        lead.setAgent(agent);
        lead.setAssignedDate(LocalDateTime.now());
        lead.setPriority("MEDIUM");

        leadRepository.save(lead);
    }
}