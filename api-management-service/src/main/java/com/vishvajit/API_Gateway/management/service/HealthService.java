package com.vishvajit.API_Gateway.management.service;

import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class HealthService {

    private final JdbcTemplate jdbcTemplate;

    public String getHealth() {
        String dbStatus = "DOWN";

        try {
            Integer result = jdbcTemplate.queryForObject("select 1", Integer.class);

            if (Integer.valueOf(1).equals(result)) {
                dbStatus = "UP";
            }
        } catch (DataAccessException e) {
            System.out.println("Database is not reachable: "+ e);
        }

        return dbStatus
    }
}
