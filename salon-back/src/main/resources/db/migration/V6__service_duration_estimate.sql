-- Duração aproximada em texto (ex.: "Em média 50 min"); duration_min fica opcional para cálculo interno de sobreposição
ALTER TABLE tb_salon_service ALTER COLUMN duration_min DROP NOT NULL;

ALTER TABLE tb_salon_service ADD COLUMN duration_estimate VARCHAR(160);

UPDATE tb_salon_service
SET duration_estimate = CONCAT('Em média ', duration_min, ' min')
WHERE duration_estimate IS NULL AND duration_min IS NOT NULL;
