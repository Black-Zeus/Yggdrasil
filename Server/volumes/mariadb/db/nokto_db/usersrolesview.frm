TYPE=VIEW
query=select `u`.`id` AS `user_id`,`u`.`full_name` AS `full_name`,`u`.`email` AS `email`,`u`.`institutional_email` AS `institutional_email`,group_concat(distinct `r`.`name` order by `r`.`name` ASC separator \',\') AS `roles`,`st`.`name` AS `status`,`u`.`last_login` AS `last_login`,`u`.`email_verified_at` AS `email_verified_at`,count(distinct `fp`.`form_id`) AS `assigned_forms`,count(distinct `fr`.`id`) AS `submitted_responses` from (((((`nokto_db`.`users` `u` left join `nokto_db`.`user_roles` `ur` on(`u`.`id` = `ur`.`user_id`)) left join `nokto_db`.`roles` `r` on(`ur`.`role_id` = `r`.`id`)) join `nokto_db`.`status_types` `st` on(`u`.`status_id` = `st`.`id`)) left join `nokto_db`.`form_permissions` `fp` on(`u`.`id` = `fp`.`user_id`)) left join `nokto_db`.`form_responses` `fr` on(`u`.`id` = `fr`.`user_id`)) group by `u`.`id`
md5=1c1857d3bd1d744217ec6e667697a496
updatable=0
algorithm=0
definer_user=root
definer_host=localhost
suid=2
with_check_option=0
timestamp=0001747614996069282
create-version=2
source=SELECT u.id as user_id,\n    u.full_name,\n    u.email,\n    u.institutional_email,\n    GROUP_CONCAT(\n        DISTINCT r.name\n        ORDER BY r.name ASC\n    ) as roles,\n    st.name as status,\n    u.last_login,\n    u.email_verified_at,\n    COUNT(DISTINCT fp.form_id) as assigned_forms,\n    COUNT(DISTINCT fr.id) as submitted_responses\nFROM users u\n    LEFT JOIN user_roles ur ON u.id = ur.user_id\n    LEFT JOIN roles r ON ur.role_id = r.id\n    JOIN status_types st ON u.status_id = st.id\n    LEFT JOIN form_permissions fp ON u.id = fp.user_id\n    LEFT JOIN form_responses fr ON u.id = fr.user_id\nGROUP BY u.id
client_cs_name=utf8mb3
connection_cl_name=utf8mb3_general_ci
view_body_utf8=select `u`.`id` AS `user_id`,`u`.`full_name` AS `full_name`,`u`.`email` AS `email`,`u`.`institutional_email` AS `institutional_email`,group_concat(distinct `r`.`name` order by `r`.`name` ASC separator \',\') AS `roles`,`st`.`name` AS `status`,`u`.`last_login` AS `last_login`,`u`.`email_verified_at` AS `email_verified_at`,count(distinct `fp`.`form_id`) AS `assigned_forms`,count(distinct `fr`.`id`) AS `submitted_responses` from (((((`nokto_db`.`users` `u` left join `nokto_db`.`user_roles` `ur` on(`u`.`id` = `ur`.`user_id`)) left join `nokto_db`.`roles` `r` on(`ur`.`role_id` = `r`.`id`)) join `nokto_db`.`status_types` `st` on(`u`.`status_id` = `st`.`id`)) left join `nokto_db`.`form_permissions` `fp` on(`u`.`id` = `fp`.`user_id`)) left join `nokto_db`.`form_responses` `fr` on(`u`.`id` = `fr`.`user_id`)) group by `u`.`id`
mariadb-version=100621
