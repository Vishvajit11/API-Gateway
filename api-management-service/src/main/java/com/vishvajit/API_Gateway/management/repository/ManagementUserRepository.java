package com.vishvajit.API_Gateway.management.repository;

import com.vishvajit.API_Gateway.management.entity.ManagementUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ManagementUserRepository extends JpaRepository<ManagementUser, Long> {

    Optional<ManagementUser> findByUsername(String username);

    Optional<ManagementUser> findByOrganizationId(Long organizationId);

    boolean existsByUsername(String username);
}
