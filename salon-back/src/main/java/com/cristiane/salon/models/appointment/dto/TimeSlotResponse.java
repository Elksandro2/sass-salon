package com.cristiane.salon.models.appointment.dto;

import java.time.LocalTime;

public record TimeSlotResponse(
        LocalTime time,
        boolean available
) {}
