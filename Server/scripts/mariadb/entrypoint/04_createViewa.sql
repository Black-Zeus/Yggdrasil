-- =====================
-- 1. Vistas de Usuarios y Permisos
-- =====================

-- Vista consolidada de usuarios y roles
CREATE VIEW usersRolesView AS
SELECT u.id as user_id,
    u.full_name,
    u.email,
    u.institutional_email,
    GROUP_CONCAT(
        DISTINCT r.name
        ORDER BY r.name ASC
    ) as roles,
    st.name as status,
    u.last_login,
    u.email_verified_at,
    COUNT(DISTINCT fp.form_id) as assigned_forms,
    COUNT(DISTINCT fr.id) as submitted_responses
FROM users u
    LEFT JOIN user_roles ur ON u.id = ur.user_id
    LEFT JOIN roles r ON ur.role_id = r.id
    JOIN status_types st ON u.status_id = st.id
    LEFT JOIN form_permissions fp ON u.id = fp.user_id
    LEFT JOIN form_responses fr ON u.id = fr.user_id
GROUP BY u.id;

-- Vista detallada de permisos por usuario
CREATE VIEW userPermissionsDetailedView AS
SELECT u.id as user_id,
    u.full_name,
    u.email,
    f.id as form_id,
    f.title as form_title,
    pt.code as permission_type,
    pt.name as permission_name,
    pc.code as capability,
    pc.name as capability_name,
    ptc.value as capability_value,
    fp.granted_at,
    fp.expires_at,
    ug.full_name as granted_by
FROM users u
    JOIN form_permissions fp ON u.id = fp.user_id
    JOIN forms f ON fp.form_id = f.id
    JOIN permission_types pt ON fp.permission_type_id = pt.id
    JOIN permission_type_capabilities ptc ON pt.id = ptc.permission_type_id
    JOIN permission_capabilities pc ON ptc.capability_id = pc.id
    JOIN users ug ON fp.granted_by = ug.id
WHERE fp.is_active = TRUE;

-- Vista de usuarios inactivos
CREATE VIEW inactiveUsersView AS
SELECT u.id,
    u.full_name,
    u.email,
    u.last_login,
    DATEDIFF(
        CURRENT_TIMESTAMP,
        COALESCE(u.last_login, u.created_at)
    ) as days_inactive,
    COUNT(DISTINCT fp.form_id) as pending_forms
FROM users u
    LEFT JOIN form_permissions fp ON u.id = fp.user_id
    LEFT JOIN form_responses fr ON fp.form_id = fr.form_id
    AND u.id = fr.user_id
WHERE (
        u.last_login IS NULL
        OR u.last_login < DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 30 DAY)
    )
    AND u.status_id = (
        SELECT id
        FROM status_types
        WHERE code = 'active'
    )
GROUP BY u.id;

-- =====================
-- 2. Vistas de Formularios
-- =====================

-- Vista de formularios activos
CREATE VIEW activeFormsView AS
SELECT f.*,
    c.name as category_name,
    sc.name as subcategory_name,
    u.full_name as created_by_name,
    st.name as status_name,
    COUNT(DISTINCT fp.user_id) as assigned_users,
    COUNT(DISTINCT fr.id) as total_responses,
    ROUND(
        COUNT(DISTINCT fr.id) * 100.0 / NULLIF(COUNT(DISTINCT fp.user_id), 0),
        2
    ) as response_rate
FROM forms f
    JOIN categories c ON f.category_id = c.id
    LEFT JOIN subcategories sc ON f.subcategory_id = sc.id
    JOIN users u ON f.created_by = u.id
    JOIN status_types st ON f.status_id = st.id
    LEFT JOIN form_permissions fp ON f.id = fp.form_id
    LEFT JOIN form_responses fr ON f.id = fr.form_id
WHERE f.status_id IN (
        SELECT id
        FROM status_types
        WHERE code IN ('active', 'published')
    )
GROUP BY f.id;

-- Vista de estadísticas de formularios
CREATE VIEW formsStatsView AS
SELECT f.id,
    f.title,
    f.visibility,
    c.name as category,
    sc.name as subcategory,
    st.name as status,
    u.full_name as created_by,
    COUNT(DISTINCT fq.id) as total_questions,
    COUNT(DISTINCT fp.id) as total_participants,
    COUNT(DISTINCT fr.id) as total_responses,
    MIN(fr.submitted_at) as first_response,
    MAX(fr.submitted_at) as last_response,
    AVG(
        TIMESTAMPDIFF(MINUTE, fr.created_at, fr.submitted_at)
    ) as avg_completion_time_minutes
FROM forms f
    JOIN categories c ON f.category_id = c.id
    LEFT JOIN subcategories sc ON f.subcategory_id = sc.id
    JOIN status_types st ON f.status_id = st.id
    JOIN users u ON f.created_by = u.id
    LEFT JOIN form_questions fq ON f.id = fq.form_id
    LEFT JOIN form_permissions fp ON f.id = fp.form_id
    LEFT JOIN form_responses fr ON f.id = fr.form_id
GROUP BY f.id;

-- Vista de borradores de formularios
CREATE VIEW draftFormsView AS
SELECT f.id,
    f.title,
    f.description,
    u.full_name as created_by,
    f.created_at,
    DATEDIFF(CURRENT_TIMESTAMP, f.created_at) as days_in_draft,
    COUNT(DISTINCT fq.id) as questions_count,
    f.draft_data
FROM forms f
    JOIN users u ON f.created_by = u.id
    LEFT JOIN form_questions fq ON f.id = fq.form_id
WHERE f.status_id = (
        SELECT id
        FROM status_types
        WHERE code = 'draft'
    )
GROUP BY f.id;

-- =====================
-- 3. Vistas de Respuestas
-- =====================
-- Vista resumen de respuestas
CREATE VIEW formResponsesSummary AS
SELECT f.id as form_id,
    f.title,
    COUNT(DISTINCT fr.id) as total_responses,
    COUNT(DISTINCT fr.user_id) as unique_respondents,
    COUNT(
        DISTINCT CASE
            WHEN fr.manual_signature_key IS NOT NULL THEN fr.id
        END
    ) as signed_responses,
    MIN(fr.submitted_at) as first_response,
    MAX(fr.submitted_at) as last_response,
    ROUND(
        AVG(
            TIMESTAMPDIFF(MINUTE, fr.created_at, fr.submitted_at)
        ),
        2
    ) as avg_completion_time_minutes
FROM forms f
    LEFT JOIN form_responses fr ON f.id = fr.form_id
GROUP BY f.id;

-- Vista de respuestas por usuario
CREATE VIEW userResponsesView AS
SELECT u.id as user_id,
    u.full_name,
    f.id as form_id,
    f.title as form_title,
    fr.submitted_at,
    fr.status_id,
    st.name as response_status,
    COUNT(ra.id) as answered_questions,
    CASE
        WHEN fr.manual_signature_key IS NOT NULL THEN 'Firmado'
        ELSE 'No firmado'
    END as signature_status
FROM users u
    JOIN form_responses fr ON u.id = fr.user_id
    JOIN forms f ON fr.form_id = f.id
    JOIN status_types st ON fr.status_id = st.id
    LEFT JOIN response_answers ra ON fr.id = ra.response_id
GROUP BY fr.id;

-- Vista de respuestas pendientes
CREATE VIEW pendingResponsesView AS
SELECT u.id as user_id,
    u.full_name,
    f.id as form_id,
    f.title,
    f.deadline,
    DATEDIFF(f.deadline, CURRENT_DATE) as days_remaining,
    fp.granted_at as assigned_at,
    COUNT(DISTINCT fq.id) as total_questions
FROM users u
    JOIN form_permissions fp ON u.id = fp.user_id
    JOIN forms f ON fp.form_id = f.id
    LEFT JOIN form_responses fr ON f.id = fr.form_id
    AND u.id = fr.user_id
    LEFT JOIN form_questions fq ON f.id = fq.form_id
WHERE fr.id IS NULL
    AND f.status_id = (
        SELECT id
        FROM status_types
        WHERE code = 'published'
    )
    AND (
        f.deadline IS NULL
        OR f.deadline >= CURRENT_DATE
    )
GROUP BY u.id,
    f.id;

-- =====================
-- 4. Vistas de Auditoría
-- =====================

-- Resumen de auditoría de formularios
CREATE VIEW formAuditSummary AS
SELECT f.id as form_id,
    f.title as form_title,
    u.full_name as user_name,
    fal.action,
    COUNT(*) as action_count,
    MIN(fal.created_at) as first_action,
    MAX(fal.created_at) as last_action,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'action',
            fal.action,
            'details',
            fal.details,
            'created_at',
            fal.created_at
        )
    ) as action_history
FROM form_audit_log fal
    JOIN forms f ON fal.form_id = f.id
    JOIN users u ON fal.user_id = u.id
GROUP BY f.id,
    fal.action,
    u.id;

-- Actividad de usuarios
CREATE VIEW userActivityView AS
SELECT 
    u.id as user_id,
    u.full_name,
    u.email,
    MAX(fal.created_at) as last_activity,
    COUNT(DISTINCT fal.form_id) as forms_interacted
FROM users u
LEFT JOIN form_audit_log fal ON u.id = fal.user_id
GROUP BY u.id;


-- =====================
-- 5. Vistas Analíticas
-- =====================
-- Uso de categorías
CREATE VIEW categoryUsageView AS
SELECT c.id as category_id,
    c.name as category_name,
    sc.id as subcategory_id,
    sc.name as subcategory_name,
    COUNT(DISTINCT f.id) as total_forms,
    COUNT(
        DISTINCT CASE
            WHEN f.status_id = (
                SELECT id
                FROM status_types
                WHERE code = 'published'
            ) THEN f.id
        END
    ) as active_forms,
    COUNT(DISTINCT fr.id) as total_responses,
    COUNT(DISTINCT fr.user_id) as unique_respondents
FROM categories c
    LEFT JOIN subcategories sc ON c.id = sc.category_id
    LEFT JOIN forms f ON c.id = f.category_id
    OR sc.id = f.subcategory_id
    LEFT JOIN form_responses fr ON f.id = fr.form_id
GROUP BY c.id,
    sc.id;

-- Tasas de respuesta
CREATE VIEW responseRateView AS
SELECT f.id as form_id,
    f.title,
    COUNT(DISTINCT fp.user_id) as total_assigned,
    COUNT(DISTINCT fr.id) as total_responses,
    COUNT(DISTINCT fr.user_id) as unique_respondents,
    ROUND(
        COUNT(DISTINCT fr.id) * 100.0 / NULLIF(COUNT(DISTINCT fp.user_id), 0),
        2
    ) as response_rate,
    AVG(
        TIMESTAMPDIFF(HOUR, fr.created_at, fr.submitted_at)
    ) as avg_response_time_hours
FROM forms f
    LEFT JOIN form_permissions fp ON f.id = fp.form_id
    LEFT JOIN form_responses fr ON f.id = fr.form_id
WHERE f.status_id = (
        SELECT id
        FROM status_types
        WHERE code = 'published'
    )
GROUP BY f.id;

-- =====================
-- 6. Vistas Operativas
-- =====================
-- Formularios próximos a vencer
CREATE VIEW expiringFormsView AS
SELECT f.id,
    f.title,
    f.deadline,
    f.deadline_time,
    DATEDIFF(f.deadline, CURRENT_DATE) as days_until_deadline,
    COUNT(DISTINCT fp.user_id) as assigned_users,
    COUNT(DISTINCT fr.id) as responses_received,
    COUNT(DISTINCT fp.user_id) - COUNT(DISTINCT fr.user_id) as pending_responses,
    CASE
        WHEN DATEDIFF(f.deadline, CURRENT_DATE) < 0 THEN 'Vencido'
        WHEN DATEDIFF(f.deadline, CURRENT_DATE) = 0 THEN 'Vence hoy'
        WHEN DATEDIFF(f.deadline, CURRENT_DATE) <= 3 THEN 'Crítico'
        WHEN DATEDIFF(f.deadline, CURRENT_DATE) <= 7 THEN 'Próximo a vencer'
        ELSE 'En tiempo'
    END as urgency_status
FROM forms f
    LEFT JOIN form_permissions fp ON f.id = fp.form_id
    LEFT JOIN form_responses fr ON f.id = fr.form_id
WHERE f.status_id = (
        SELECT id
        FROM status_types
        WHERE code = 'published'
    )
    AND f.deadline IS NOT NULL
GROUP BY f.id
HAVING days_until_deadline >= -30;

-- Carga de trabajo por usuario
CREATE VIEW userResponsesByStatusView AS
SELECT u.id as user_id,
       st.name as status_name,
       COUNT(DISTINCT fr.id) as responses
FROM users u
JOIN form_permissions fp ON u.id = fp.user_id
JOIN forms f ON fp.form_id = f.id
LEFT JOIN form_responses fr ON f.id = fr.form_id AND u.id = fr.user_id
LEFT JOIN status_types st ON fr.status_id = st.id
GROUP BY u.id, st.name;


-- Estado de validación
CREATE VIEW formValidationView AS
SELECT f.id as form_id,
    f.title,
    COUNT(fr.id) as total_responses,
    COUNT(
        CASE
            WHEN fr.status_id = (
                SELECT id
                FROM status_types
                WHERE code = 'published'
            ) THEN 1
        END
    ) as validated_responses,
    COUNT(
        CASE
            WHEN fr.manual_signature_key IS NOT NULL THEN 1
        END
    ) as signed_responses,
    COUNT(
        CASE
            WHEN fr.status_id != (
                SELECT id
                FROM status_types
                WHERE code = 'published'
            ) THEN 1
        END
    ) as pending_validation,
    ROUND(
        COUNT(
            CASE
                WHEN fr.status_id = (
                    SELECT id
                    FROM status_types
                    WHERE code = 'published'
                ) THEN 1
            END
        ) * 100.0 / NULLIF(COUNT(fr.id), 0),
        2
    ) as validation_rate
FROM forms f
    LEFT JOIN form_responses fr ON f.id = fr.form_id
GROUP BY f.id;

-- Cola de notificaciones
CREATE VIEW notificationQueueView AS
SELECT 'deadline_approaching' as notification_type,
    f.id as form_id,
    f.title,
    u.id as user_id,
    u.full_name,
    u.email,
    f.deadline as relevant_date,
    DATEDIFF(f.deadline, CURRENT_DATE) as days_remaining
FROM forms f
    JOIN form_permissions fp ON f.id = fp.form_id
    JOIN users u ON fp.user_id = u.id
    LEFT JOIN form_responses fr ON f.id = fr.form_id
    AND u.id = fr.user_id
WHERE f.status_id = (
        SELECT id
        FROM status_types
        WHERE code = 'published'
    )
    AND fr.id IS NULL
    AND f.deadline >= CURRENT_DATE
    AND DATEDIFF(f.deadline, CURRENT_DATE) <= 7
UNION ALL
SELECT 'response_validation_needed' as notification_type,
    f.id as form_id,
    f.title,
    u.id as user_id,
    u.full_name,
    u.email,
    fr.submitted_at as relevant_date,
    DATEDIFF(CURRENT_DATE, fr.submitted_at) as days_pending
FROM forms f
    JOIN form_responses fr ON f.id = fr.form_id
    JOIN users u ON f.created_by = u.id
WHERE fr.status_id = (
        SELECT id
        FROM status_types
        WHERE code = 'pending'
    );