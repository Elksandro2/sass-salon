package com.cristiane.salon.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;

@Component
@RequiredArgsConstructor
@Slf4j
public class AuditLogTableInitializer implements ApplicationRunner {

    private final DataSource dataSource;
    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        if (auditTableExists()) {
            return;
        }

        log.warn("Tabela tb_audit_log ausente. Criando estrutura mínima automaticamente.");
        jdbcTemplate.execute("""
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
                )
                """);
        jdbcTemplate.execute("CREATE INDEX IF NOT EXISTS idx_audit_user_id ON tb_audit_log(user_id)");
        jdbcTemplate.execute("CREATE INDEX IF NOT EXISTS idx_audit_action ON tb_audit_log(action)");
        jdbcTemplate.execute("CREATE INDEX IF NOT EXISTS idx_audit_entity_type ON tb_audit_log(entity_type)");
        jdbcTemplate.execute("CREATE INDEX IF NOT EXISTS idx_audit_created_at ON tb_audit_log(created_at)");
        jdbcTemplate.execute("CREATE INDEX IF NOT EXISTS idx_audit_user_email ON tb_audit_log(user_email)");
    }

    private boolean auditTableExists() throws Exception {
        try (Connection connection = dataSource.getConnection()) {
            DatabaseMetaData metaData = connection.getMetaData();
            try (ResultSet tables = metaData.getTables(null, null, "tb_audit_log", new String[]{"TABLE"})) {
                return tables.next();
            }
        }
    }
}