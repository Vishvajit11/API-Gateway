package com.vishvajit.API_Gateway.management.repository;

import com.vishvajit.API_Gateway.management.entity.ApiRoute;
import com.vishvajit.API_Gateway.management.enums.OrganizationStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApiRouteRepository extends JpaRepository<ApiRoute, Long> {
    boolean existsByOrganizationIdAndRouteId(Long id, @NotBlank @Size(max = 100) String routeId);

    Optional<ApiRoute> findByIdAndOrganizationId(Long id, Long organizationId);

    List<ApiRoute> findAllByOrganizationId(Long id);

    List<ApiRoute> findAllByActiveTrueAndOrganizationStatus(OrganizationStatus organizationStatus);
}
