TYPE=VIEW
query=select `f`.`id` AS `id`,`f`.`title` AS `title`,`f`.`description` AS `description`,`u`.`full_name` AS `created_by`,`f`.`created_at` AS `created_at`,to_days(current_timestamp()) - to_days(`f`.`created_at`) AS `days_in_draft`,count(distinct `fq`.`id`) AS `questions_count`,`f`.`draft_data` AS `draft_data` from ((`nokto_db`.`forms` `f` join `nokto_db`.`users` `u` on(`f`.`created_by` = `u`.`id`)) left join `nokto_db`.`form_questions` `fq` on(`f`.`id` = `fq`.`form_id`)) where `f`.`status_id` = (select `nokto_db`.`status_types`.`id` from `nokto_db`.`status_types` where `nokto_db`.`status_types`.`code` = \'draft\') group by `f`.`id`
md5=9f9046385957f1d548bbbb8664f289fb
updatable=0
algorithm=0
definer_user=root
definer_host=localhost
suid=2
with_check_option=0
timestamp=0001747614996203693
create-version=2
source=SELECT f.id,\n    f.title,\n    f.description,\n    u.full_name as created_by,\n    f.created_at,\n    DATEDIFF(CURRENT_TIMESTAMP, f.created_at) as days_in_draft,\n    COUNT(DISTINCT fq.id) as questions_count,\n    f.draft_data\nFROM forms f\n    JOIN users u ON f.created_by = u.id\n    LEFT JOIN form_questions fq ON f.id = fq.form_id\nWHERE f.status_id = (\n        SELECT id\n        FROM status_types\n        WHERE code = \'draft\'\n    )\nGROUP BY f.id
client_cs_name=utf8mb3
connection_cl_name=utf8mb3_general_ci
view_body_utf8=select `f`.`id` AS `id`,`f`.`title` AS `title`,`f`.`description` AS `description`,`u`.`full_name` AS `created_by`,`f`.`created_at` AS `created_at`,to_days(current_timestamp()) - to_days(`f`.`created_at`) AS `days_in_draft`,count(distinct `fq`.`id`) AS `questions_count`,`f`.`draft_data` AS `draft_data` from ((`nokto_db`.`forms` `f` join `nokto_db`.`users` `u` on(`f`.`created_by` = `u`.`id`)) left join `nokto_db`.`form_questions` `fq` on(`f`.`id` = `fq`.`form_id`)) where `f`.`status_id` = (select `nokto_db`.`status_types`.`id` from `nokto_db`.`status_types` where `nokto_db`.`status_types`.`code` = \'draft\') group by `f`.`id`
mariadb-version=100621
