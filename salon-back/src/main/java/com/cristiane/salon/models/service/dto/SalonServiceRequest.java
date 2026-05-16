package com.cristiane.salon.models.service.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record SalonServiceRequest(
        @NotBlank(message = "O nome é obrigatório")
        String name,

        String description,

        /** Opcional: exibido como &quot;a partir de&quot; no site */
        @Min(value = 0, message = "O preço não pode ser negativo")
        BigDecimal price,

        /**
         * Texto livre para o cliente (ex.: &quot;Em média 50 min&quot;).
         * Pelo menos um entre durationEstimate e durationMin deve ser informado (validado no serviço).
         */
        @Size(max = 160, message = "Texto de duração muito longo")
        String durationEstimate,

        /** Opcional: minutos para cálculo de choque de horário na agenda */
        @Min(value = 1, message = "A duração mínima é 1 minuto")
        Integer durationMin,

        Boolean active
) {}
