package com.cristiane.salon.models.employee.dto;

import com.cristiane.salon.models.employee.entity.RemunerationType;
import com.cristiane.salon.models.employee.entity.CommissionScope;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record EmployeeRequest(
        @NotNull(message = "O ID do usuário é obrigatório")
        Long userId,

        String bio,

        RemunerationType remunerationType,

        CommissionScope commissionScope,

        BigDecimal remunerationValue
) {}
