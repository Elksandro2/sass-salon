-- V7__create_audit_log_table.sql
-- Tabela de auditoria para registrar todas as ações realizadas no sistema

CREATE TABLE tb_audit_log (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id BIGINT,
    details TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    status VARCHAR(20) NOT NULL,
    error_message TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhorar performance
CREATE INDEX idx_audit_user_id ON tb_audit_log(user_id);
CREATE INDEX idx_audit_action ON tb_audit_log(action);
CREATE INDEX idx_audit_entity_type ON tb_audit_log(entity_type);
CREATE INDEX idx_audit_created_at ON tb_audit_log(created_at);
CREATE INDEX idx_audit_user_email ON tb_audit_log(user_email);
