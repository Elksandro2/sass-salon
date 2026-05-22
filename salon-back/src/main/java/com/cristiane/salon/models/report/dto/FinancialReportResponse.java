package com.cristiane.salon.models.report.dto;

import java.math.BigDecimal;
import java.util.List;

public record FinancialReportResponse(
        BigDecimal totalIncome,
        BigDecimal totalExpense,
        BigDecimal totalSalaryPaid,
        BigDecimal totalCommissionPaid,
        BigDecimal netProfit,
        List<EmployeeFinanceResponse> employeeFinanceDetails,
        String period
) {}
