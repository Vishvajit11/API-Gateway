package com.vishvajit.API_Gateway.management.service;

import com.vishvajit.API_Gateway.management.entity.Organization;
import com.vishvajit.API_Gateway.management.enums.OrganizationStatus;
import com.vishvajit.API_Gateway.management.exception.ApiException;
import com.vishvajit.API_Gateway.management.repository.OrganizationRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

@Component
public class TenantContext {

    private final OrganizationRepository organizationRepository;

    public TenantContext(OrganizationRepository organizationRepository) {
        this.organizationRepository = organizationRepository;
    }

    public Organization getOrganization() {
        Authentication auth = SecurityContextHolder
                .getContext()
                .getAuthentication();

        if(!(auth instanceof JwtAuthenticationToken)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Tenant identity is missing");
        }

        Long organizationId = ((JwtAuthenticationToken) auth).getToken()
                .getClaim("organizationId");

        if(organizationId == null){
            throw new ApiException(HttpStatus.FORBIDDEN, "Tenant identity is missing");
        }

        Organization organization = organizationRepository.findById(organizationId)
                .orElseThrow(() ->
                        new ApiException(
                                HttpStatus.FORBIDDEN,
                                "Organization does not exists"
                        )
                );

        if(organization.getStatus() != OrganizationStatus.ACTIVE) {
            throw new ApiException(HttpStatus.FORBIDDEN, "The organization is not active");
        }
        return organization;
    }
}
