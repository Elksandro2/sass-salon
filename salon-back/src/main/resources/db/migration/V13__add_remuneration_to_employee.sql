-- Add remuneration columns to employee table
ALTER TABLE tb_employee ADD COLUMN remuneration_type VARCHAR(50);
ALTER TABLE tb_employee ADD COLUMN commission_scope VARCHAR(50);
ALTER TABLE tb_employee ADD COLUMN remuneration_value NUMERIC(10, 2);
