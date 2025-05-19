TYPE=VIEW
query=select `f`.`id` AS `form_id`,`f`.`title` AS `form_title`,`u`.`full_name` AS `user_name`,`fal`.`action` AS `action`,count(0) AS `action_count`,min(`fal`.`created_at`) AS `first_action`,max(`fal`.`created_at`) AS `last_action`,json_arrayagg(json_object(\'action\',`fal`.`action`,\'details\',`fal`.`details`,\'created_at\',`fal`.`created_at`)) AS `action_history` from ((`nokto_db`.`form_audit_log` `fal` join `nokto_db`.`forms` `f` on(`fal`.`form_id` = `f`.`id`)) join `nokto_db`.`users` `u` on(`fal`.`user_id` = `u`.`id`)) group by `f`.`id`,`fal`.`action`,`u`.`id`
md5=a071dbc07a37dc1692100aa2dbe51f9f
updatable=0
algorithm=0
definer_user=root
definer_host=localhost
suid=2
with_check_option=0
timestamp=0001747614996286426
create-version=2
source=SELECT f.id as form_id,\n    f.title as form_title,\n    u.full_name as user_name,\n    fal.action,\n    COUNT(*) as action_count,\n    MIN(fal.created_at) as first_action,\n    MAX(fal.created_at) as last_action,\n    JSON_ARRAYAGG(\n        JSON_OBJECT(\n            \'action\',\n            fal.action,\n            \'details\',\n            fal.details,\n            \'created_at\',\n            fal.created_at\n        )\n    ) as action_history\nFROM form_audit_log fal\n    JOIN forms f ON fal.form_id = f.id\n    JOIN users u ON fal.user_id = u.id\nGROUP BY f.id,\n    fal.action,\n    u.id
client_cs_name=utf8mb3
connection_cl_name=utf8mb3_general_ci
view_body_utf8=select `f`.`id` AS `form_id`,`f`.`title` AS `form_title`,`u`.`full_name` AS `user_name`,`fal`.`action` AS `action`,count(0) AS `action_count`,min(`fal`.`created_at`) AS `first_action`,max(`fal`.`created_at`) AS `last_action`,json_arrayagg(json_object(\'action\',`fal`.`action`,\'details\',`fal`.`details`,\'created_at\',`fal`.`created_at`)) AS `action_history` from ((`nokto_db`.`form_audit_log` `fal` join `nokto_db`.`forms` `f` on(`fal`.`form_id` = `f`.`id`)) join `nokto_db`.`users` `u` on(`fal`.`user_id` = `u`.`id`)) group by `f`.`id`,`fal`.`action`,`u`.`id`
mariadb-version=100621
