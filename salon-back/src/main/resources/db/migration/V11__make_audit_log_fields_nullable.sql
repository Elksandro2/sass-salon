-- V11__make_audit_log_fields_nullable.sql
-- Permite que registros de auditoria contenham valores nulos para user_id e user_email (ex: ações automáticas do sistema ou acessos de visitantes não autenticados/falhas de login)

ALTER TABLE tb_audit_log ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE tb_audit_log ALTER COLUMN user_email DROP NOT NULL;
