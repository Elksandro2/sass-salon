package com.cristiane.salon.models.report.dto;

import java.math.BigDecimal;

public record EmployeeFinanceResponse(
        Long employeeId,
        String employeeName,
        String remunerationType,
        BigDecimal remunerationValue,
        String commissionScope,
        BigDecimal commissionValue,
        long doneAppointmentsCount,
        BigDecimal doneAppointmentsValue,
        BigDecimal calculatedPayout
) {}
