package com.cristiane.salon.models.service.dto;

import com.cristiane.salon.models.service.entity.SalonService;

import java.math.BigDecimal;

public record SalonServiceResponse(
        Long id,
        String name,
        String description,
        BigDecimal price,
        Integer durationMin,
        String durationEstimate,
        Boolean active
) {
    public static SalonServiceResponse fromEntity(SalonService service) {
        return new SalonServiceResponse(
                service.getId(),
                service.getName(),
                service.getDescription(),
                service.getPrice(),
                service.getDurationMin(),
                service.getDurationEstimate(),
                service.getActive()
        );
    }
}
