package com.vishvajit.API_Gateway.management.service;

import com.nimbusds.jwt.JWTClaimsSet;
import com.vishvajit.API_Gateway.management.dto.requstDTO.LoginRequest;
import com.vishvajit.API_Gateway.management.dto.responseDTO.LoginResponse;
import com.vishvajit.API_Gateway.management.entity.ManagementUser;
import com.vishvajit.API_Gateway.management.enums.OrganizationStatus;
import com.vishvajit.API_Gateway.management.exception.ApiException;
import com.vishvajit.API_Gateway.management.repository.ManagementUserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class AuthenticationService {

    private final ManagementUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtEncoder jwtEncoder;
    private final String expirationSecond;

    public AuthenticationService(
            ManagementUserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtEncoder jwtEncoder,
            @Value("${security.jwt.expiration-seconds}") String expirationSecond
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtEncoder = jwtEncoder;
        this.expirationSecond = expirationSecond;
    }

    public LoginResponse login(LoginRequest loginRequest) {

        ManagementUser user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(
                        () -> invalidCredentials()
                );

        if(!user.isEnabled() ||
                !passwordEncoder.matches(
                        loginRequest.getPassword(),
                        user.getPasswordHash()
                ))
        {
            throw invalidCredentials();
        }

        if(user.getOrganization() != null &&
                user.getOrganization().getStatus() != OrganizationStatus.ACTIVE
        ) {
            throw new ApiException(HttpStatus.FORBIDDEN ,"The organization is not active");
        }

        Instant issuedAt = Instant.now();
        String role = user.getRole().getName();
        Long organizationId = user.getOrganization() == null ?
                null : user.getOrganization().getId();

        JwtClaimsSet.Builder claims = JwtClaimsSet.builder()
                .issuedAt(issuedAt)
                .expiresAt(issuedAt.plusSeconds(Long.parseLong(expirationSecond)))
                .issuer("gatekeeper-api-management")
                .subject(user.getUsername())
                .claim("role", role);

        if(organizationId != null) {
            claims.claim("organizationId", organizationId);
        }

        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();

        String token = jwtEncoder
                .encode(JwtEncoderParameters
                        .from(header, claims.build())
                ).getTokenValue();

        return new LoginResponse(
                token,
                "Bearer",
                Long.parseLong(expirationSecond),
                role,
                organizationId
        );
    }

    private RuntimeException invalidCredentials() {
        return new ApiException(HttpStatus.UNAUTHORIZED, "Invalid Username or Password");
    }
}
