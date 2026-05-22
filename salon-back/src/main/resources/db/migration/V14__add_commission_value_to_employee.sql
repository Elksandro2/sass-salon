-- Add commission_value column to employee table for hybrid remuneration models
ALTER TABLE tb_employee ADD COLUMN commission_value NUMERIC(10, 2);
