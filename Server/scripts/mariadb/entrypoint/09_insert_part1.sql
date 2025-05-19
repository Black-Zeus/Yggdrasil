-- Status Types
INSERT INTO status_types (code, name, description, is_active) VALUES
('active', 'Activo', 'Elemento activo en el sistema', true),
('inactive', 'Inactivo', 'Elemento inactivo en el sistema', true),
('pending', 'Pendiente', 'Elemento pendiente de revisión', true),
('draft', 'Borrador', 'Elemento en estado borrador', true),
('published', 'Publicado', 'Elemento publicado y disponible', true),
('archived', 'Archivado', 'Elemento archivado', true),
('deleted', 'Eliminado', 'Elemento marcado como eliminado', false);

-- Roles básicos
INSERT INTO roles (code, name, description) VALUES
('admin', 'Administrador', 'Acceso completo al sistema'),
('manager', 'Gestor', 'Puede gestionar formularios y estructuras'),
('participant', 'Participante', 'Puede responder formularios asignados'),
('viewer', 'Visualizador', 'Puede ver formularios y respuestas');

-- Tipos de permisos
INSERT INTO permission_types (code, name, description) VALUES
('admin', 'Administrador', 'Control total del sistema'),
('manage', 'Gestor', 'Puede crear y modificar estructuras de formularios'),
('participant', 'Participante', 'Puede responder y gestionar sus propias respuestas'),
('view', 'Visualizador', 'Solo puede ver formularios y respuestas');

-- Capacidades
INSERT INTO permission_capabilities (code, name, description) VALUES
('view_forms', 'Ver Formularios', 'Permite ver formularios vacíos'),
('view_responses', 'Ver Respuestas', 'Permite ver respuestas de formularios'),
('submit_forms', 'Enviar Respuestas', 'Permite responder formularios'),
('edit_own_responses', 'Editar Respuestas Propias', 'Permite editar sus propias respuestas'),
('create_forms', 'Crear Formularios', 'Permite crear nuevos formularios'),
('edit_forms', 'Editar Formularios', 'Permite modificar formularios'),
('delete_forms', 'Eliminar Formularios', 'Permite eliminar formularios'),
('manage_permissions', 'Gestionar Permisos', 'Permite gestionar permisos de usuarios'),
('view_analytics', 'Ver Análisis', 'Permite ver reportes y análisis');

-- Asignar capacidades a tipos de permisos
-- Para Administrador
INSERT INTO permission_type_capabilities 
(permission_type_id, capability_id, value) 
SELECT 
    (SELECT id FROM permission_types WHERE code = 'admin'),
    id,
    'true'
FROM permission_capabilities;

-- Para Gestor
INSERT INTO permission_type_capabilities 
(permission_type_id, capability_id, value) 
VALUES
((SELECT id FROM permission_types WHERE code = 'manage'),
 (SELECT id FROM permission_capabilities WHERE code = 'view_forms'), 'true'),
((SELECT id FROM permission_types WHERE code = 'manage'),
 (SELECT id FROM permission_capabilities WHERE code = 'view_responses'), 'true'),
((SELECT id FROM permission_types WHERE code = 'manage'),
 (SELECT id FROM permission_capabilities WHERE code = 'submit_forms'), 'true'),
((SELECT id FROM permission_types WHERE code = 'manage'),
 (SELECT id FROM permission_capabilities WHERE code = 'edit_own_responses'), 'unpublished_only'),
((SELECT id FROM permission_types WHERE code = 'manage'),
 (SELECT id FROM permission_capabilities WHERE code = 'create_forms'), 'true'),
((SELECT id FROM permission_types WHERE code = 'manage'),
 (SELECT id FROM permission_capabilities WHERE code = 'edit_forms'), 'structure_only'),
((SELECT id FROM permission_types WHERE code = 'manage'),
 (SELECT id FROM permission_capabilities WHERE code = 'delete_forms'), 'unpublished_only'),
((SELECT id FROM permission_types WHERE code = 'manage'),
 (SELECT id FROM permission_capabilities WHERE code = 'view_analytics'), 'true');

-- Para Participante
INSERT INTO permission_type_capabilities 
(permission_type_id, capability_id, value) 
VALUES
((SELECT id FROM permission_types WHERE code = 'participant'),
 (SELECT id FROM permission_capabilities WHERE code = 'view_forms'), 'true'),
((SELECT id FROM permission_types WHERE code = 'participant'),
 (SELECT id FROM permission_capabilities WHERE code = 'view_responses'), 'own_only'),
((SELECT id FROM permission_types WHERE code = 'participant'),
 (SELECT id FROM permission_capabilities WHERE code = 'submit_forms'), 'true'),
((SELECT id FROM permission_types WHERE code = 'participant'),
 (SELECT id FROM permission_capabilities WHERE code = 'edit_own_responses'), 'unpublished_only'),
((SELECT id FROM permission_types WHERE code = 'participant'),
 (SELECT id FROM permission_capabilities WHERE code = 'view_analytics'), 'own_only');

-- Para Visualizador
INSERT INTO permission_type_capabilities 
(permission_type_id, capability_id, value) 
VALUES
((SELECT id FROM permission_types WHERE code = 'view'),
 (SELECT id FROM permission_capabilities WHERE code = 'view_forms'), 'true'),
((SELECT id FROM permission_types WHERE code = 'view'),
 (SELECT id FROM permission_capabilities WHERE code = 'view_responses'), 'true'),
((SELECT id FROM permission_types WHERE code = 'view'),
 (SELECT id FROM permission_capabilities WHERE code = 'view_analytics'), 'true');

-- Categorías principales
INSERT INTO categories (id, name, description) VALUES
('general', 'General', 'Formularios de propósito general'),
('rrhh', 'Recursos Humanos', 'Formularios relacionados con RRHH'),
('calidad', 'Calidad', 'Formularios de control de calidad'),
('operaciones', 'Operaciones', 'Formularios operativos'),
('otros', 'Otros', 'Otros tipos de formularios');

-- Subcategorías
INSERT INTO subcategories (id, category_id, name, description) VALUES
-- General
('encuestas', 'general', 'Encuestas', 'Encuestas generales'),
('feedback', 'general', 'Retroalimentación', 'Formularios de feedback'),

-- RRHH
('evaluacion', 'rrhh', 'Evaluación', 'Evaluaciones de personal'),
('capacitacion', 'rrhh', 'Capacitación', 'Formularios de capacitación'),
('solicitudes', 'rrhh', 'Solicitudes', 'Solicitudes de RRHH'),

-- Calidad
('auditorias', 'calidad', 'Auditorías', 'Formularios de auditoría'),
('incidentes', 'calidad', 'Incidentes', 'Registro de incidentes'),
('mejoras', 'calidad', 'Mejoras', 'Propuestas de mejora'),

-- Operaciones
('mantenimiento', 'operaciones', 'Mantenimiento', 'Formularios de mantenimiento'),
('reportes', 'operaciones', 'Reportes', 'Reportes operativos'),
('inspecciones', 'operaciones', 'Inspecciones', 'Formularios de inspección');

-- Usuario administrador por defecto (password: Admin123*)
-- Usando PBKDF2 para el hash
INSERT INTO users (full_name, email, password_hash, secret_key, status_id) VALUES
('Administrador del Sistema', 'admin@sistema.com', 
'$pbkdf2-sha256$480000$O4dw7v3/n9O6d651TkmJEQ$9VOQmNN/GxfD4MQIPGbEJbQ.aVgahSNcntsZCFtm77Q', "fb789842-9bcc-4cd4-a443-0bd44969a805",
(SELECT id FROM status_types WHERE code = 'active'));

-- Asignar rol de administrador
INSERT INTO user_roles (user_id, role_id) VALUES 
(1, (SELECT id FROM roles WHERE code = 'admin'));