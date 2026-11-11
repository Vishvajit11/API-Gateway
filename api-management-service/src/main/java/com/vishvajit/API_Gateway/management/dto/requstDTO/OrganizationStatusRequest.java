package com.vishvajit.API_Gateway.management.dto.requstDTO;

import com.vishvajit.API_Gateway.management.enums.OrganizationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrganizationStatusRequest {

    @NotNull
    private OrganizationStatus status;
}
