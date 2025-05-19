
-- ====================================
-- CREACIÓN DE Usario DB
-- ====================================
--yggdrasil — de noche en esperanto, suena a sistema que funciona en segundo plano o analiza sin que lo veas.

-- Asignar privilegios completos al usuario 'yggdrasil' en la base de datos 'yggdrasil'
GRANT ALL PRIVILEGES ON yggdrasil.* TO 'yggdrasil'@'%';

-- Asignar privilegios completos al usuario 'root' en todas las bases de datos, pero solo desde 'localhost'
GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' WITH GRANT OPTION;

-- Aplicar cambios en privilegios
FLUSH PRIVILEGES;
