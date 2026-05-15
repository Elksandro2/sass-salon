-- Seed roles
INSERT INTO tb_role (name) VALUES
    ('ADMIN'),
    ('GERENTE_DE_ATENDIMENTO'),
    ('FUNCIONARIA'),
    ('CLIENTE');

-- Wildcard permission for ADMIN
INSERT INTO tb_permission (name, endpoint, http_method, classe) VALUES
    ('Acesso Total', '/**', '*', 'Administração');

-- Bind wildcard permission to ADMIN role
INSERT INTO tb_role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM tb_role r, tb_permission p
WHERE r.name = 'ADMIN' AND p.name = 'Acesso Total';

-- Seed default ADMIN user (password: Admin@123 — bcrypt)
INSERT INTO tb_user (name, email, password, role_id)
SELECT
    'Administrador',
    'admin@salao.com',
    '$2a$10$UTfuKSTnRmrXsHWLMQ1mpuxLO4a5n1AcmfuUwlcsnpAUw4JTd7O7y',
    r.id
FROM tb_role r WHERE r.name = 'ADMIN';
