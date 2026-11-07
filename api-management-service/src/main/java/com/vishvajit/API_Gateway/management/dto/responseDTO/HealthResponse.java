package com.vishvajit.API_Gateway.management.dto.responseDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@AllArgsConstructor
@Getter
@Setter
public class HealthResponse {

    private String serverStatus;
    private String dbStatus;
    private LocalDateTime timStamp;
}
