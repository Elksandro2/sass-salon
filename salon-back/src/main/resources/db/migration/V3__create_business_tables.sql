-- Business logic tables

CREATE TABLE tb_service (
    id           BIGSERIAL PRIMARY KEY,
    name         VARCHAR(150)   NOT NULL,
    description  TEXT,
    price        NUMERIC(10, 2) NOT NULL,
    duration_min INTEGER        NOT NULL,
    active       BOOLEAN        NOT NULL DEFAULT TRUE
);

CREATE TABLE tb_product (
    id     BIGSERIAL PRIMARY KEY,
    name   VARCHAR(150)   NOT NULL,
    stock  INTEGER        NOT NULL DEFAULT 0,
    price  NUMERIC(10, 2) NOT NULL
);

CREATE TABLE tb_employee (
    id      BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES tb_user(id),
    bio     TEXT
);

CREATE TABLE tb_appointment (
    id           BIGSERIAL PRIMARY KEY,
    client_id    BIGINT       NOT NULL REFERENCES tb_user(id),
    employee_id  BIGINT       NOT NULL REFERENCES tb_employee(id),
    service_id   BIGINT       NOT NULL REFERENCES tb_service(id),
    scheduled_at TIMESTAMP    NOT NULL,
    status       VARCHAR(20)  NOT NULL DEFAULT 'PENDING' -- PENDING, CONFIRMED, DONE, CANCELLED
);

CREATE TABLE tb_cashflow (
    id             BIGSERIAL PRIMARY KEY,
    type           VARCHAR(10)    NOT NULL, -- INCOME, EXPENSE
    amount         NUMERIC(10, 2) NOT NULL,
    description    VARCHAR(255)   NOT NULL,
    date           DATE           NOT NULL,
    appointment_id BIGINT         REFERENCES tb_appointment(id)
);
