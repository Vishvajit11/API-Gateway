package com.vishvajit.API_Gateway.management.dto.responseDTO;

import com.vishvajit.API_Gateway.management.entity.ManagementUser;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TenantAdminResponse {

    private Long id;
    private Long organizationId;
    private String username;
    private boolean enabled;

    public static TenantAdminResponse from(ManagementUser user) {
        return new TenantAdminResponse(
                user.getId(),
                user.getOrganization().getId(),
                user.getUsername(),
                user.isEnabled()
        );
    }
}
