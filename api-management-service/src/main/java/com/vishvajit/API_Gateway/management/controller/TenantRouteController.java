package com.vishvajit.API_Gateway.management.controller;

import com.vishvajit.API_Gateway.management.dto.requstDTO.RouteRequest;
import com.vishvajit.API_Gateway.management.dto.requstDTO.RouteStatusRequest;
import com.vishvajit.API_Gateway.management.dto.responseDTO.AuditRecordResponse;
import com.vishvajit.API_Gateway.management.dto.responseDTO.RouteResponse;
import com.vishvajit.API_Gateway.management.dto.responseDTO.RouteVersionResponse;
import com.vishvajit.API_Gateway.management.service.RouteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tenant")
public class TenantRouteController {

    private final RouteService routeService;

    public TenantRouteController(RouteService routeService) {
        this.routeService = routeService;
    }

    @PostMapping("/routes")
    public ResponseEntity<RouteResponse> createRoute(
            @Valid @RequestBody RouteRequest routeRequest
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(routeService.create(routeRequest));
    }

    @GetMapping("/routes")
    public ResponseEntity<List<RouteResponse>> findAll() {
        return ResponseEntity.ok(routeService.findAllForTenant());
    }

    @GetMapping("/routes/{id}")
    public ResponseEntity<RouteResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(routeService.findById(id));
    }

    @PutMapping("/routes/{id}")
    public ResponseEntity<RouteResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody RouteRequest request
    ) {
        return ResponseEntity.ok(routeService.update(id, request));
    }

    @PatchMapping("/routes/{id}/status")
    public ResponseEntity<RouteResponse> changeStatus(
            @PathVariable Long id,
            @Valid @RequestBody RouteStatusRequest request
    ) {
        return ResponseEntity.ok(routeService.changeStatus(id, request));
    }

    @DeleteMapping("/routes/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        routeService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/route-versions/{routeId}")
    public ResponseEntity<List<RouteVersionResponse>> getVersions(
            @PathVariable String routeId) {
        return ResponseEntity.ok(routeService.getVersions(routeId));
    }

    @GetMapping("/audit-records")
    public ResponseEntity<List<AuditRecordResponse>> getAuditRecords() {
        return ResponseEntity.ok(routeService.getAuditRecords());
    }
}
