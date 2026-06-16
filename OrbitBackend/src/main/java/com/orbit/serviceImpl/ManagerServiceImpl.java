package com.orbit.serviceImpl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.orbit.entity.Admin;
import com.orbit.entity.Manager;
import com.orbit.repository.AdminRepository;
import com.orbit.repository.ManagerRepository;
import com.orbit.service.ManagerService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ManagerServiceImpl implements ManagerService {

    private final ManagerRepository managerRepository;
    private final AdminRepository adminRepository; // ✅ ADD THIS

    @Override
    public Manager saveManager(Manager manager) {

        // 🔥 FIX: Handle admin properly
        if (manager.getAdmin() != null && manager.getAdmin().getId() != null) {

            Admin admin = adminRepository.findById(manager.getAdmin().getId())
                    .orElseThrow(() -> new RuntimeException("Admin not found"));

            manager.setAdmin(admin);
        } else {
            manager.setAdmin(null);
        }

        return managerRepository.save(manager);
    }

    @Override
    public List<Manager> getAllManagers() {
        return managerRepository.findAll();
    }

    @Override
    public Manager getManagerById(Long id) {
        return managerRepository.findById(id).orElse(null);
    }

    @Override
    public Manager updateManager(Long id, Manager manager) {

        Manager existing = managerRepository.findById(id).orElse(null);

        if (existing != null) {
            existing.setName(manager.getName());
            existing.setEmail(manager.getEmail());
            existing.setPhone(manager.getPhone());
            existing.setStatus(manager.getStatus());

            // 🔥 also update admin safely
            if (manager.getAdmin() != null && manager.getAdmin().getId() != null) {
                Admin admin = adminRepository.findById(manager.getAdmin().getId())
                        .orElseThrow(() -> new RuntimeException("Admin not found"));
                existing.setAdmin(admin);
            }

            return managerRepository.save(existing);
        }

        return null;
    }

    @Override
    public void deleteManager(Long id) {
        managerRepository.deleteById(id);
    }
}