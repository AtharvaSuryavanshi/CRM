package com.orbit.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.orbit.entity.Lead;
import com.orbit.enums.LeadStatus;

import java.util.List;

public interface LeadRepository extends JpaRepository<Lead, Long> {

	List<Lead> findByStatus(LeadStatus status);

    List<Lead> findByAgentId(Long agentId);
}