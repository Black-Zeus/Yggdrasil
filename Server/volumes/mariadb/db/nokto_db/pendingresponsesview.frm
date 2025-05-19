TYPE=VIEW
query=select `u`.`id` AS `user_id`,`u`.`full_name` AS `full_name`,`f`.`id` AS `form_id`,`f`.`title` AS `title`,`f`.`deadline` AS `deadline`,to_days(`f`.`deadline`) - to_days(curdate()) AS `days_remaining`,`fp`.`granted_at` AS `assigned_at`,count(distinct `fq`.`id`) AS `total_questions` from ((((`nokto_db`.`users` `u` join `nokto_db`.`form_permissions` `fp` on(`u`.`id` = `fp`.`user_id`)) join `nokto_db`.`forms` `f` on(`fp`.`form_id` = `f`.`id`)) left join `nokto_db`.`form_responses` `fr` on(`f`.`id` = `fr`.`form_id` and `u`.`id` = `fr`.`user_id`)) left join `nokto_db`.`form_questions` `fq` on(`f`.`id` = `fq`.`form_id`)) where `fr`.`id` is null and `f`.`status_id` = (select `nokto_db`.`status_types`.`id` from `nokto_db`.`status_types` where `nokto_db`.`status_types`.`code` = \'published\') and (`f`.`deadline` is null or `f`.`deadline` >= curdate()) group by `u`.`id`,`f`.`id`
md5=2d6d37c74cc863d6e68d4b8f485640e8
updatable=0
algorithm=0
definer_user=root
definer_host=localhost
suid=2
with_check_option=0
timestamp=0001747614996260004
create-version=2
source=SELECT u.id as user_id,\n    u.full_name,\n    f.id as form_id,\n    f.title,\n    f.deadline,\n    DATEDIFF(f.deadline, CURRENT_DATE) as days_remaining,\n    fp.granted_at as assigned_at,\n    COUNT(DISTINCT fq.id) as total_questions\nFROM users u\n    JOIN form_permissions fp ON u.id = fp.user_id\n    JOIN forms f ON fp.form_id = f.id\n    LEFT JOIN form_responses fr ON f.id = fr.form_id\n    AND u.id = fr.user_id\n    LEFT JOIN form_questions fq ON f.id = fq.form_id\nWHERE fr.id IS NULL\n    AND f.status_id = (\n        SELECT id\n        FROM status_types\n        WHERE code = \'published\'\n    )\n    AND (\n        f.deadline IS NULL\n        OR f.deadline >= CURRENT_DATE\n    )\nGROUP BY u.id,\n    f.id
client_cs_name=utf8mb3
connection_cl_name=utf8mb3_general_ci
view_body_utf8=select `u`.`id` AS `user_id`,`u`.`full_name` AS `full_name`,`f`.`id` AS `form_id`,`f`.`title` AS `title`,`f`.`deadline` AS `deadline`,to_days(`f`.`deadline`) - to_days(curdate()) AS `days_remaining`,`fp`.`granted_at` AS `assigned_at`,count(distinct `fq`.`id`) AS `total_questions` from ((((`nokto_db`.`users` `u` join `nokto_db`.`form_permissions` `fp` on(`u`.`id` = `fp`.`user_id`)) join `nokto_db`.`forms` `f` on(`fp`.`form_id` = `f`.`id`)) left join `nokto_db`.`form_responses` `fr` on(`f`.`id` = `fr`.`form_id` and `u`.`id` = `fr`.`user_id`)) left join `nokto_db`.`form_questions` `fq` on(`f`.`id` = `fq`.`form_id`)) where `fr`.`id` is null and `f`.`status_id` = (select `nokto_db`.`status_types`.`id` from `nokto_db`.`status_types` where `nokto_db`.`status_types`.`code` = \'published\') and (`f`.`deadline` is null or `f`.`deadline` >= curdate()) group by `u`.`id`,`f`.`id`
mariadb-version=100621
