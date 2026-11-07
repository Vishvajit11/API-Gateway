package com.vishvajit.API_Gateway.management.controller;

import com.vishvajit.API_Gateway.management.dto.responseDTO.HealthResponse;
import com.vishvajit.API_Gateway.management.service.HealthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping
public class HealthController {

    private final HealthService healthService;

    public HealthController(HealthService healthService) {
        this.healthService = healthService;
    }

    @GetMapping("/health")
    public ResponseEntity<HealthResponse> health() {
        String dbStatus = healthService.getHealth();
        return ResponseEntity.ok(new HealthResponse(
                "server is UP",
                "Database is: "+dbStatus,
                LocalDateTime.now()));
    }
}