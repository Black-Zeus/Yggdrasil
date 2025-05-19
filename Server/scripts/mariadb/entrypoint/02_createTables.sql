-- Configuración inicial
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Estados del sistema
CREATE TABLE status_types (
    id TINYINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(30) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Usuarios
CREATE TABLE users (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    institutional_email VARCHAR(150) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    secret_key VARCHAR(255),
    status_id TINYINT UNSIGNED NOT NULL,
    email_verified_at TIMESTAMP NULL,
    last_login DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME,
    FOREIGN KEY (status_id) REFERENCES status_types(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Menu
CREATE TABLE `menu_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `label` VARCHAR(100) NOT NULL,
  `path` VARCHAR(255) NOT NULL,
  `icon` VARCHAR(50) NULL,
  `order` INT DEFAULT 0,
  `is_active` BOOLEAN DEFAULT TRUE,
  `parent_id` INT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_parent_id` (`parent_id`),
  CONSTRAINT `fk_menu_item_parent` 
    FOREIGN KEY (`parent_id`) 
    REFERENCES `menu_items` (`id`) 
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Roles
CREATE TABLE roles (
    id SMALLINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(30) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Relación usuarios ↔ roles
CREATE TABLE user_roles (
    user_id INT UNSIGNED,
    role_id SMALLINT UNSIGNED,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tipos de permisos base
CREATE TABLE permission_types (
    id SMALLINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(30) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Capacidades específicas
CREATE TABLE permission_capabilities (
    id SMALLINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(30) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Relación entre tipos de permisos y capacidades
CREATE TABLE permission_type_capabilities (
    permission_type_id SMALLINT UNSIGNED NOT NULL,
    capability_id SMALLINT UNSIGNED NOT NULL,
    value ENUM('true', 'false', 'own_only', 'unpublished_only', 'structure_only') NOT NULL,
    PRIMARY KEY (permission_type_id, capability_id),
    FOREIGN KEY (permission_type_id) REFERENCES permission_types(id) ON DELETE CASCADE,
    FOREIGN KEY (capability_id) REFERENCES permission_capabilities(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Categorías
CREATE TABLE categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Subcategorías
CREATE TABLE subcategories (
    id VARCHAR(50) PRIMARY KEY,
    category_id VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Formularios
CREATE TABLE forms (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    uuid CHAR(36) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category_id VARCHAR(50),
    subcategory_id VARCHAR(50),
    visibility ENUM('Pública', 'Privada', 'Restringida') DEFAULT 'Privada',
    allow_anonymous BOOLEAN DEFAULT FALSE,
    require_institutional_email BOOLEAN DEFAULT FALSE,
    limit_one_response BOOLEAN DEFAULT FALSE,
    require_signature BOOLEAN DEFAULT FALSE,
    deadline DATE,
    deadline_time TIME,
    version_number INT DEFAULT 1,
    parent_form_id INT UNSIGNED,
    draft_data JSON,
    preview_config JSON,
    additional_options JSON,
    status_id TINYINT UNSIGNED NOT NULL,
    created_by INT UNSIGNED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_preview_at TIMESTAMP NULL,
    start_date DATE,
    end_date DATE,
    FOREIGN KEY (status_id) REFERENCES status_types(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (subcategory_id) REFERENCES subcategories(id),
    FOREIGN KEY (parent_form_id) REFERENCES forms(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Permisos de formularios
CREATE TABLE form_permissions (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    form_id INT UNSIGNED NOT NULL,
    user_id INT UNSIGNED,
    role_id SMALLINT UNSIGNED,
    permission_type_id SMALLINT UNSIGNED NOT NULL,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    granted_by INT UNSIGNED NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (form_id) REFERENCES forms(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_type_id) REFERENCES permission_types(id),
    FOREIGN KEY (granted_by) REFERENCES users(id),
    CONSTRAINT check_permission_target CHECK (
        (user_id IS NOT NULL AND role_id IS NULL) OR 
        (user_id IS NULL AND role_id IS NOT NULL)
    )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Preguntas de formularios
CREATE TABLE form_questions (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    form_id INT UNSIGNED NOT NULL,
    question_uid VARCHAR(50),
    `order` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type ENUM(
        'text',
        'textarea', 
        'dropdown', 
        'single_choice', 
        'multiple_choice',
        'matrix', 
        'ranking',
        'range'
    ) NOT NULL,
    prompt TEXT,
    is_required BOOLEAN DEFAULT FALSE,
    validation JSON,
    extra_config JSON,
    status_id TINYINT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (form_id) REFERENCES forms(id) ON DELETE CASCADE,
    FOREIGN KEY (status_id) REFERENCES status_types(id),
    UNIQUE KEY unique_order_in_form (form_id, `order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Opciones por pregunta
CREATE TABLE question_options (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    question_id INT UNSIGNED NOT NULL,
    `value` VARCHAR(100) NOT NULL,
    label VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES form_questions(id) ON DELETE CASCADE,
    UNIQUE KEY unique_option_in_question (question_id, `value`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Ítems para preguntas de matriz y ranking
CREATE TABLE question_items (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    question_id INT UNSIGNED NOT NULL,
    item_uid VARCHAR(50) NOT NULL,
    label VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES form_questions(id) ON DELETE CASCADE,
    UNIQUE KEY unique_item_in_question (question_id, item_uid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Respuestas a formularios
CREATE TABLE form_responses (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    form_id INT UNSIGNED NOT NULL,
    user_id INT UNSIGNED,
    response_token VARCHAR(255) UNIQUE,
    ip_address VARCHAR(45),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    manual_signature_key VARCHAR(255),
    signed_by_name VARCHAR(150),
    signed_by_email VARCHAR(150),
    status_id TINYINT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (form_id) REFERENCES forms(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (status_id) REFERENCES status_types(id),
    UNIQUE KEY one_response_per_form_per_user (form_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Respuestas por pregunta
CREATE TABLE response_answers (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    response_id INT UNSIGNED NOT NULL,
    question_id INT UNSIGNED NOT NULL,
    answer JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (response_id) REFERENCES form_responses(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES form_questions(id) ON DELETE CASCADE,
    UNIQUE KEY unique_answer (response_id, question_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Registro de auditoría
CREATE TABLE form_audit_log (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    form_id INT UNSIGNED NOT NULL,
    user_id INT UNSIGNED,
    action VARCHAR(50) NOT NULL,
    details JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (form_id) REFERENCES forms(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


--Dispositivos (Celular / Tablet)
CREATE TABLE devices (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    device_physical_id VARCHAR(200) NOT NULL,
    user_id INT UNSIGNED,
    status_id TINYINT UNSIGNED NOT NULL,
    operating_system ENUM('ANDROID', 'IOS') NOT NULL,
    register_code CHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (status_id) REFERENCES status_types(id),
    UNIQUE KEY (register_code),
    UNIQUE KEY (device_physical_id)
);

SET FOREIGN_KEY_CHECKS = 1;