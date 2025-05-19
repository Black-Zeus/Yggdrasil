TYPE=VIEW
query=select `u`.`id` AS `id`,`u`.`full_name` AS `full_name`,`u`.`email` AS `email`,`u`.`last_login` AS `last_login`,to_days(current_timestamp()) - to_days(coalesce(`u`.`last_login`,`u`.`created_at`)) AS `days_inactive`,count(distinct `fp`.`form_id`) AS `pending_forms` from ((`nokto_db`.`users` `u` left join `nokto_db`.`form_permissions` `fp` on(`u`.`id` = `fp`.`user_id`)) left join `nokto_db`.`form_responses` `fr` on(`fp`.`form_id` = `fr`.`form_id` and `u`.`id` = `fr`.`user_id`)) where (`u`.`last_login` is null or `u`.`last_login` < current_timestamp() - interval 30 day) and `u`.`status_id` = (select `nokto_db`.`status_types`.`id` from `nokto_db`.`status_types` where `nokto_db`.`status_types`.`code` = \'active\') group by `u`.`id`
md5=bfc8034d38e40e3cfceb4f871921be9c
updatable=0
algorithm=0
definer_user=root
definer_host=localhost
suid=2
with_check_option=0
timestamp=0001747614996132598
create-version=2
source=SELECT u.id,\n    u.full_name,\n    u.email,\n    u.last_login,\n    DATEDIFF(\n        CURRENT_TIMESTAMP,\n        COALESCE(u.last_login, u.created_at)\n    ) as days_inactive,\n    COUNT(DISTINCT fp.form_id) as pending_forms\nFROM users u\n    LEFT JOIN form_permissions fp ON u.id = fp.user_id\n    LEFT JOIN form_responses fr ON fp.form_id = fr.form_id\n    AND u.id = fr.user_id\nWHERE (\n        u.last_login IS NULL\n        OR u.last_login < DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 30 DAY)\n    )\n    AND u.status_id = (\n        SELECT id\n        FROM status_types\n        WHERE code = \'active\'\n    )\nGROUP BY u.id
client_cs_name=utf8mb3
connection_cl_name=utf8mb3_general_ci
view_body_utf8=select `u`.`id` AS `id`,`u`.`full_name` AS `full_name`,`u`.`email` AS `email`,`u`.`last_login` AS `last_login`,to_days(current_timestamp()) - to_days(coalesce(`u`.`last_login`,`u`.`created_at`)) AS `days_inactive`,count(distinct `fp`.`form_id`) AS `pending_forms` from ((`nokto_db`.`users` `u` left join `nokto_db`.`form_permissions` `fp` on(`u`.`id` = `fp`.`user_id`)) left join `nokto_db`.`form_responses` `fr` on(`fp`.`form_id` = `fr`.`form_id` and `u`.`id` = `fr`.`user_id`)) where (`u`.`last_login` is null or `u`.`last_login` < current_timestamp() - interval 30 day) and `u`.`status_id` = (select `nokto_db`.`status_types`.`id` from `nokto_db`.`status_types` where `nokto_db`.`status_types`.`code` = \'active\') group by `u`.`id`
mariadb-version=100621
