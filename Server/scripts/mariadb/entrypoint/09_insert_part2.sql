-- Menús principales (primer nivel)
INSERT INTO `menu_items` (`id`, `label`, `path`, `icon`, `order`, `is_active`, `parent_id`) 
VALUES (1, 'Form Engine', '/FormEngine', 'RiFileListLine', 1, 1, NULL);

INSERT INTO `menu_items` (`id`, `label`, `path`, `icon`, `order`, `is_active`, `parent_id`) 
VALUES (2, 'Reportes', '/Reports', 'RiBarChartBoxLine', 2, 1, NULL);

INSERT INTO `menu_items` (`id`, `label`, `path`, `icon`, `order`, `is_active`, `parent_id`) 
VALUES (3, 'Configuración', '/Settings', 'RiSettings3Line', 3, 1, NULL);

INSERT INTO `menu_items` (`id`, `label`, `path`, `icon`, `order`, `is_active`, `parent_id`) 
VALUES (4, 'Ayuda', '/Help', 'RiQuestionLine', 4, 1, NULL);

INSERT INTO `menu_items` (`id`, `label`, `path`, `icon`, `order`, `is_active`, `parent_id`) 
VALUES (5, 'Administración', '/Admin', 'RiAdminLine', 5, 1, NULL);

INSERT INTO `menu_items` (`id`, `label`, `path`, `icon`, `order`, `is_active`, `parent_id`) 
VALUES (6, 'Cuenta', '/Account', 'RiUserLine', 6, 1, NULL);

INSERT INTO `menu_items` (`id`, `label`, `path`, `icon`, `order`, `is_active`, `parent_id`) 
VALUES (7, 'Formularios', '/Forms', 'RiFileTextLine', 7, 1, NULL);

-- Submenús para Evaluaciones
INSERT INTO `menu_items` (`id`, `label`, `path`, `icon`, `order`, `is_active`, `parent_id`) 
VALUES (11, 'Crear Evaluación', '/FormEngine/CreateEvaluation', 'RiAddCircleLine', 1, 1, 1);

INSERT INTO `menu_items` (`id`, `label`, `path`, `icon`, `order`, `is_active`, `parent_id`) 
VALUES (12, 'Cargar Evaluación', '/FormEngine/LoadEvaluation', 'RiFileTextLine', 2, 1, 1);

INSERT INTO `menu_items` (`id`, `label`, `path`, `icon`, `order`, `is_active`, `parent_id`) 
VALUES (13, 'Importar JSON', '/FormEngine/ImportJSON', 'RiCodeLine', 3, 1, 1);

-- Submenús para Reportes
INSERT INTO `menu_items` (`id`, `label`, `path`, `icon`, `order`, `is_active`, `parent_id`) 
VALUES (21, 'Estadísticas', '/Reports/Statistics', 'RiPieChartLine', 1, 1, 2);

INSERT INTO `menu_items` (`id`, `label`, `path`, `icon`, `order`, `is_active`, `parent_id`) 
VALUES (22, 'Resultados', '/Reports/Results', 'RiFileChartLine', 2, 1, 2);

INSERT INTO `menu_items` (`id`, `label`, `path`, `icon`, `order`, `is_active`, `parent_id`) 
VALUES (23, 'Desempeño', '/Reports/Performance', 'RiLineChartLine', 3, 1, 2);

-- Submenús para Configuración
INSERT INTO `menu_items` (`id`, `label`, `path`, `icon`, `order`, `is_active`, `parent_id`) 
VALUES (31, 'General', '/Settings/General', 'RiToolsLine', 1, 1, 3);

INSERT INTO `menu_items` (`id`, `label`, `path`, `icon`, `order`, `is_active`, `parent_id`) 
VALUES (32, 'Usuarios', '/Settings/Users', 'RiUserSettingsLine', 2, 1, 3);

INSERT INTO `menu_items` (`id`, `label`, `path`, `icon`, `order`, `is_active`, `parent_id`) 
VALUES (33, 'Permisos', '/Settings/Permissions', 'RiLockLine', 3, 1, 3);


-- Submenús para Ayuda
INSERT INTO `menu_items` (`id`, `label`, `path`, `icon`, `order`, `is_active`, `parent_id`) 
VALUES (41, 'Guías', '/Help/Guides', 'RiBookOpenLine', 1, 1, 4);

INSERT INTO `menu_items` (`id`, `label`, `path`, `icon`, `order`, `is_active`, `parent_id`) 
VALUES (44, 'Acerca de', '/Help/About', 'RiInformationLine', 2, 1, 4);

INSERT INTO `menu_items` (`id`, `label`, `path`, `icon`, `order`, `is_active`, `parent_id`) 
VALUES (45, 'Soporte', '/Help/Support', 'RiCustomerServiceLine', 3, 1, 4);

-- Submenús para Administración
INSERT INTO `menu_items` (`id`, `label`, `path`, `icon`, `order`, `is_active`, `parent_id`) 
VALUES (51, 'Panel de Control', '/Admin/Dashboard', 'RiDashboardLine', 1, 1, 5);

INSERT INTO `menu_items` (`id`, `label`, `path`, `icon`, `order`, `is_active`, `parent_id`) 
VALUES (52, 'Logs del Sistema', '/Admin/Logs', 'RiFileListLine', 2, 1, 5);

INSERT INTO `menu_items` (`id`, `label`, `path`, `icon`, `order`, `is_active`, `parent_id`) 
VALUES (53, 'Respaldos', '/Admin/Backup', 'RiDatabase2Line', 3, 1, 5);

-- Submenús para Cuenta
INSERT INTO `menu_items` (`id`, `label`, `path`, `icon`, `order`, `is_active`, `parent_id`) 
VALUES (61, 'Perfil', '/Account/Profile', 'RiUserSettingsLine', 1, 1, 6);

INSERT INTO `menu_items` (`id`, `label`, `path`, `icon`, `order`, `is_active`, `parent_id`) 
VALUES (62, 'Preferencias', '/Account/Preferences', 'RiSettings4Line', 2, 1, 6);

INSERT INTO `menu_items` (`id`, `label`, `path`, `icon`, `order`, `is_active`, `parent_id`) 
VALUES (63, 'Seguridad', '/Account/Security', 'RiShieldLine', 3, 1, 6);

INSERT INTO `menu_items` (`id`, `label`, `path`, `icon`, `order`, `is_active`, `parent_id`) 
VALUES (64, 'Notificaciones', '/Account/Notifications', 'RiBellLine', 4, 1, 6);

INSERT INTO `menu_items` (`id`, `label`, `path`, `icon`, `order`, `is_active`, `parent_id`) 
VALUES (65, 'Dispositivos', '/Account/Device', 'RiDeviceLine', 5, 1, 6);

-- Submenú para Formularios (nuevo)
INSERT INTO `menu_items` (`id`, `label`, `path`, `icon`, `order`, `is_active`, `parent_id`) 
VALUES (71, 'Evaluaciones y Control de Desempeño', '/Forms/Performance', 'RiBarChart2Line', 1, 1, 7);

INSERT INTO `menu_items` (`id`, `label`, `path`, `icon`, `order`, `is_active`, `parent_id`) 
VALUES (72, 'Operaciones y Servicio en Terreno', '/Forms/Operations', 'RiTruckLine', 2, 1, 7);

INSERT INTO `menu_items` (`id`, `label`, `path`, `icon`, `order`, `is_active`, `parent_id`) 
VALUES (73, 'Soporte y Servicio Técnico', '/Forms/Support', 'RiToolsLine', 3, 1, 7);

INSERT INTO `menu_items` (`id`, `label`, `path`, `icon`, `order`, `is_active`, `parent_id`) 
VALUES (74, 'Seguridad y Prevención', '/Forms/Safety', 'RiShieldCheckLine', 4, 1, 7);

INSERT INTO `menu_items` (`id`, `label`, `path`, `icon`, `order`, `is_active`, `parent_id`) 
VALUES (75, 'Personalizados y Libres', '/Forms/Custom', 'RiEdit2Line', 5, 1, 7);