package com.cristiane.salon.models.report.service;

import com.cristiane.salon.models.appointment.entity.Appointment;
import com.cristiane.salon.models.appointment.enums.AppointmentStatus;
import com.cristiane.salon.models.appointment.repository.AppointmentRepository;
import com.cristiane.salon.models.cashflow.entity.CashFlow;
import com.cristiane.salon.models.cashflow.enums.CashFlowType;
import com.cristiane.salon.models.cashflow.repository.CashFlowRepository;
import com.cristiane.salon.models.employee.entity.Employee;
import com.cristiane.salon.models.report.dto.AppointmentReportResponse;
import com.cristiane.salon.models.report.dto.FinancialReportResponse;
import com.cristiane.salon.models.service.entity.SalonService;
import com.cristiane.salon.models.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ReportServiceTest {

    @Mock
    private CashFlowRepository cashFlowRepository;

    @Mock
    private AppointmentRepository appointmentRepository;

    @InjectMocks
    private ReportService reportService;

    @BeforeEach
    void setUp() {
    }

    @Test
    void shouldGenerateFinancialReportCorrectly() {
        // Given
        CashFlow income1 = new CashFlow();
        income1.setType(CashFlowType.INCOME);
        income1.setAmount(new BigDecimal("100.00"));

        CashFlow income2 = new CashFlow();
        income2.setType(CashFlowType.INCOME);
        income2.setAmount(new BigDecimal("50.00"));

        CashFlow expense1 = new CashFlow();
        expense1.setType(CashFlowType.EXPENSE);
        expense1.setAmount(new BigDecimal("30.00"));

        when(cashFlowRepository.findByDateBetween(any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(List.of(income1, income2, expense1));

        // When
        FinancialReportResponse report = reportService.generateFinancialReport(LocalDate.now(), LocalDate.now());

        // Then
        assertEquals(new BigDecimal("150.00"), report.totalIncome());
        assertEquals(new BigDecimal("30.00"), report.totalExpense());
        assertEquals(new BigDecimal("120.00"), report.netProfit());
    }

    @Test
    void shouldGenerateAppointmentReportCorrectly() {
        // Given
        User mockUser = new User();
        mockUser.setName("Employee 1");

        Employee employee = new Employee();
        employee.setUser(mockUser);

        SalonService salonService = new SalonService();
        salonService.setName("Haircut");

        Appointment apt1 = new Appointment();
        apt1.setStatus(AppointmentStatus.DONE);
        apt1.setScheduledAt(LocalDateTime.now().withHour(10));
        apt1.setEmployee(employee);
        apt1.setSalonService(salonService);

        Appointment apt2 = new Appointment();
        apt2.setStatus(AppointmentStatus.PENDING);
        apt2.setScheduledAt(LocalDateTime.now().withHour(14));
        apt2.setEmployee(employee);
        apt2.setSalonService(salonService);

        when(appointmentRepository.findAll()).thenReturn(List.of(apt1, apt2));

        // When
        AppointmentReportResponse report = reportService.generateAppointmentReport(LocalDate.now(), LocalDate.now());

        // Then
        assertEquals(2, report.totalAppointments());
        assertEquals(1, report.done());
        assertEquals(1, report.pending());
        assertEquals(2, report.byEmployee().get("Employee 1"));
        assertEquals(2, report.byService().get("Haircut"));
    }
}
