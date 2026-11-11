package com.vishvajit.API_Gateway.management.repository;

import com.vishvajit.API_Gateway.management.entity.RouteConfigurationVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RouteConfigurationVersionRepository extends JpaRepository<RouteConfigurationVersion, Long> {
    List<RouteConfigurationVersion> findAllByOrganizationIdAndRouteIdOrderByVersionNumberDesc(Long id, String routeId);
}
