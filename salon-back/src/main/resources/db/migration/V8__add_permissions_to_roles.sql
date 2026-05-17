-- V8__add_permissions_to_roles.sql
-- Adiciona permissões específicas para roles: GERENTE_DE_ATENDIMENTO, FUNCIONARIA e CLIENTE

-- Permissions for GERENTE_DE_ATENDIMENTO
INSERT INTO tb_permission (name, endpoint, http_method, classe) VALUES
    ('Listar Agendamentos', '/v1/appointments', 'GET', 'Agendamento'),
    ('Confirmar Agendamento', '/v1/appointments/*/confirm', 'PATCH', 'Agendamento'),
    ('Recusar Agendamento', '/v1/appointments/*/decline', 'PATCH', 'Agendamento'),
    ('Atualizar Status Agendamento', '/v1/appointments/*/status', 'PATCH', 'Agendamento'),
    ('Listar Usuários', '/v1/users', 'GET', 'Usuário'),
    ('Criar Usuário', '/v1/users', 'POST', 'Usuário'),
    ('Deletar Usuário', '/v1/users/*', 'DELETE', 'Usuário'),
    ('Listar Serviços', '/v1/services', 'GET', 'Serviço'),
    ('Criar Serviço', '/v1/services', 'POST', 'Serviço'),
    ('Listar Funcionárias', '/v1/employees', 'GET', 'Funcionária'),
    ('Criar Funcionária', '/v1/employees', 'POST', 'Funcionária'),
    ('Listar Relatórios', '/v1/reports/**', 'GET', 'Relatório'),
    ('Listar Fluxo Caixa', '/v1/cashflow', 'GET', 'Fluxo de Caixa'),
    ('Criar Fluxo Caixa', '/v1/cashflow', 'POST', 'Fluxo de Caixa'),
    ('Deletar Fluxo Caixa', '/v1/cashflow/*', 'DELETE', 'Fluxo de Caixa');

-- Permissions for FUNCIONARIA
INSERT INTO tb_permission (name, endpoint, http_method, classe) VALUES
    ('Listar Agendamentos Funcionária', '/v1/appointments', 'GET', 'Agendamento'),
    ('Ver Serviços Funcionária', '/v1/services', 'GET', 'Serviço'),
    ('Ver Dados Usuário Funcionária', '/v1/users/details/**', 'GET', 'Usuário');

-- Permissions for CLIENTE
INSERT INTO tb_permission (name, endpoint, http_method, classe) VALUES
    ('Criar Agendamento Cliente', '/v1/appointments', 'POST', 'Agendamento'),
    ('Ver Meus Agendamentos', '/v1/appointments/my', 'GET', 'Agendamento'),
    ('Cancelar Agendamento Cliente', '/v1/appointments/*/cancel', 'PATCH', 'Agendamento'),
    ('Ver Serviços Públicos', '/v1/services', 'GET', 'Serviço');

-- Bind permissions to GERENTE_DE_ATENDIMENTO role
INSERT INTO tb_role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM tb_role r, tb_permission p
WHERE r.name = 'GERENTE_DE_ATENDIMENTO' AND p.endpoint IN (
    '/v1/appointments', '/v1/appointments/*/confirm', '/v1/appointments/*/decline', '/v1/appointments/*/status',
    '/v1/users', '/v1/users/*', '/v1/services', '/v1/employees', '/v1/reports/**', '/v1/cashflow'
);

-- Bind permissions to FUNCIONARIA role
INSERT INTO tb_role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM tb_role r, tb_permission p
WHERE r.name = 'FUNCIONARIA' AND (p.name IN (
    'Listar Agendamentos Funcionária', 'Ver Serviços Funcionária', 'Ver Dados Usuário Funcionária'
));

-- Bind permissions to CLIENTE role
INSERT INTO tb_role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM tb_role r, tb_permission p
WHERE r.name = 'CLIENTE' AND (p.name IN (
    'Criar Agendamento Cliente', 'Ver Meus Agendamentos', 'Cancelar Agendamento Cliente', 'Ver Serviços Públicos'
));
