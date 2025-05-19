TYPE=VIEW
query=select `f`.`id` AS `form_id`,`f`.`title` AS `title`,count(distinct `fp`.`user_id`) AS `total_assigned`,count(distinct `fr`.`id`) AS `total_responses`,count(distinct `fr`.`user_id`) AS `unique_respondents`,round(count(distinct `fr`.`id`) * 100.0 / nullif(count(distinct `fp`.`user_id`),0),2) AS `response_rate`,avg(timestampdiff(HOUR,`fr`.`created_at`,`fr`.`submitted_at`)) AS `avg_response_time_hours` from ((`nokto_db`.`forms` `f` left join `nokto_db`.`form_permissions` `fp` on(`f`.`id` = `fp`.`form_id`)) left join `nokto_db`.`form_responses` `fr` on(`f`.`id` = `fr`.`form_id`)) where `f`.`status_id` = (select `nokto_db`.`status_types`.`id` from `nokto_db`.`status_types` where `nokto_db`.`status_types`.`code` = \'published\') group by `f`.`id`
md5=f12fc715403d3e4c66cf7a1c53111204
updatable=0
algorithm=0
definer_user=root
definer_host=localhost
suid=2
with_check_option=0
timestamp=0001747614996340341
create-version=2
source=SELECT f.id as form_id,\n    f.title,\n    COUNT(DISTINCT fp.user_id) as total_assigned,\n    COUNT(DISTINCT fr.id) as total_responses,\n    COUNT(DISTINCT fr.user_id) as unique_respondents,\n    ROUND(\n        COUNT(DISTINCT fr.id) * 100.0 / NULLIF(COUNT(DISTINCT fp.user_id), 0),\n        2\n    ) as response_rate,\n    AVG(\n        TIMESTAMPDIFF(HOUR, fr.created_at, fr.submitted_at)\n    ) as avg_response_time_hours\nFROM forms f\n    LEFT JOIN form_permissions fp ON f.id = fp.form_id\n    LEFT JOIN form_responses fr ON f.id = fr.form_id\nWHERE f.status_id = (\n        SELECT id\n        FROM status_types\n        WHERE code = \'published\'\n    )\nGROUP BY f.id
client_cs_name=utf8mb3
connection_cl_name=utf8mb3_general_ci
view_body_utf8=select `f`.`id` AS `form_id`,`f`.`title` AS `title`,count(distinct `fp`.`user_id`) AS `total_assigned`,count(distinct `fr`.`id`) AS `total_responses`,count(distinct `fr`.`user_id`) AS `unique_respondents`,round(count(distinct `fr`.`id`) * 100.0 / nullif(count(distinct `fp`.`user_id`),0),2) AS `response_rate`,avg(timestampdiff(HOUR,`fr`.`created_at`,`fr`.`submitted_at`)) AS `avg_response_time_hours` from ((`nokto_db`.`forms` `f` left join `nokto_db`.`form_permissions` `fp` on(`f`.`id` = `fp`.`form_id`)) left join `nokto_db`.`form_responses` `fr` on(`f`.`id` = `fr`.`form_id`)) where `f`.`status_id` = (select `nokto_db`.`status_types`.`id` from `nokto_db`.`status_types` where `nokto_db`.`status_types`.`code` = \'published\') group by `f`.`id`
mariadb-version=100621
