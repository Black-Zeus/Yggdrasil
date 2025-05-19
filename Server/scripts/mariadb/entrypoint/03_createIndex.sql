-- Índices para usuarios y autenticación
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_institutional_email ON users(institutional_email);
CREATE INDEX idx_users_status ON users(status_id);
CREATE INDEX idx_users_created ON users(created_at);

-- Índices para permisos
CREATE INDEX idx_permission_type_caps ON permission_type_capabilities(permission_type_id, capability_id);
CREATE INDEX idx_capability_code ON permission_capabilities(code);

-- Índices para formularios
CREATE INDEX idx_forms_uuid ON forms(uuid);
CREATE INDEX idx_forms_category ON forms(category_id);
CREATE INDEX idx_forms_subcategory ON forms(subcategory_id);
CREATE INDEX idx_forms_status ON forms(status_id);
CREATE INDEX idx_forms_created_by ON forms(created_by);
CREATE INDEX idx_forms_deadline ON forms(deadline);
CREATE INDEX idx_forms_dates ON forms(start_date, end_date);
CREATE INDEX idx_forms_visibility ON forms(visibility);

-- Índices para permisos de formularios
CREATE INDEX idx_form_permissions_form ON form_permissions(form_id);
CREATE INDEX idx_form_permissions_user ON form_permissions(user_id);
CREATE INDEX idx_form_permissions_role ON form_permissions(role_id);
CREATE INDEX idx_form_permissions_active ON form_permissions(is_active);
CREATE INDEX idx_form_permissions_expires ON form_permissions(expires_at);

-- Índices para preguntas
CREATE INDEX idx_questions_form ON form_questions(form_id);
CREATE INDEX idx_questions_type ON form_questions(type);
CREATE INDEX idx_questions_status ON form_questions(status_id);
CREATE INDEX idx_questions_uid ON form_questions(question_uid);

-- Índices para opciones e items
CREATE INDEX idx_options_question ON question_options(question_id);
CREATE INDEX idx_items_question ON question_items(question_id);
CREATE INDEX idx_items_uid ON question_items(item_uid);

-- Índices para respuestas
CREATE INDEX idx_responses_form ON form_responses(form_id);
CREATE INDEX idx_responses_user ON form_responses(user_id);
CREATE INDEX idx_responses_token ON form_responses(response_token);
CREATE INDEX idx_responses_status ON form_responses(status_id);
CREATE INDEX idx_responses_submitted ON form_responses(submitted_at);

-- Índices para respuestas individuales
CREATE INDEX idx_answers_response ON response_answers(response_id);
CREATE INDEX idx_answers_question ON response_answers(question_id);

-- Índices para auditoría
CREATE INDEX idx_audit_form ON form_audit_log(form_id);
CREATE INDEX idx_audit_user ON form_audit_log(user_id);
CREATE INDEX idx_audit_action ON form_audit_log(action);
CREATE INDEX idx_audit_created ON form_audit_log(created_at);