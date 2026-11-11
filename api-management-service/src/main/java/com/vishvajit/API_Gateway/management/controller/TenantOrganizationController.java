package com.vishvajit.API_Gateway.management.controller;

import com.vishvajit.API_Gateway.management.dto.requstDTO.TenantOrganizationRequest;
import com.vishvajit.API_Gateway.management.dto.responseDTO.OrganizationResponse;
import com.vishvajit.API_Gateway.management.service.OrganizationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tenant/organization")
public class TenantOrganizationController {

    private final OrganizationService organizationService;

    public TenantOrganizationController(OrganizationService organizationService) {
        this.organizationService = organizationService;
    }

    @GetMapping
    public ResponseEntity<OrganizationResponse> getOwnOrganization() {
        return ResponseEntity.ok(organizationService.getOwnOrganization());
    }

    @PutMapping
    public ResponseEntity<OrganizationResponse> updateOwnOrganization(
            @Valid @RequestBody TenantOrganizationRequest request
    ) {
        return ResponseEntity.ok(organizationService.updateOwnOrganization(request));
    }
}
