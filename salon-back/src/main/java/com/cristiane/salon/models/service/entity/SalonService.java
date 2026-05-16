package com.cristiane.salon.models.service.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tb_salon_service")
public class SalonService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    /** Opcional: referência &quot;a partir de&quot;; valor final no caixa */
    @Column(precision = 10, scale = 2)
    private BigDecimal price;

    /** Opcional: usado para checar sobreposição na agenda; se nulo, usa valor padrão no serviço */
    @Column(name = "duration_min")
    private Integer durationMin;

    /** Ex.: "Em média 50 min", "Em média 1h30" */
    @Column(name = "duration_estimate", length = 160)
    private String durationEstimate;

    @Column(nullable = false)
    private Boolean active = true;
}
