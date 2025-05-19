TYPE=VIEW
query=select `u`.`id` AS `user_id`,`u`.`full_name` AS `full_name`,`f`.`id` AS `form_id`,`f`.`title` AS `form_title`,`fr`.`submitted_at` AS `submitted_at`,`fr`.`status_id` AS `status_id`,`st`.`name` AS `response_status`,count(`ra`.`id`) AS `answered_questions`,case when `fr`.`manual_signature_key` is not null then \'Firmado\' else \'No firmado\' end AS `signature_status` from ((((`nokto_db`.`users` `u` join `nokto_db`.`form_responses` `fr` on(`u`.`id` = `fr`.`user_id`)) join `nokto_db`.`forms` `f` on(`fr`.`form_id` = `f`.`id`)) join `nokto_db`.`status_types` `st` on(`fr`.`status_id` = `st`.`id`)) left join `nokto_db`.`response_answers` `ra` on(`fr`.`id` = `ra`.`response_id`)) group by `fr`.`id`
md5=a33313b60d251844f9e7171a013e103c
updatable=0
algorithm=0
definer_user=root
definer_host=localhost
suid=2
with_check_option=0
timestamp=0001747614996243390
create-version=2
source=SELECT u.id as user_id,\n    u.full_name,\n    f.id as form_id,\n    f.title as form_title,\n    fr.submitted_at,\n    fr.status_id,\n    st.name as response_status,\n    COUNT(ra.id) as answered_questions,\n    CASE\n        WHEN fr.manual_signature_key IS NOT NULL THEN \'Firmado\'\n        ELSE \'No firmado\'\n    END as signature_status\nFROM users u\n    JOIN form_responses fr ON u.id = fr.user_id\n    JOIN forms f ON fr.form_id = f.id\n    JOIN status_types st ON fr.status_id = st.id\n    LEFT JOIN response_answers ra ON fr.id = ra.response_id\nGROUP BY fr.id
client_cs_name=utf8mb3
connection_cl_name=utf8mb3_general_ci
view_body_utf8=select `u`.`id` AS `user_id`,`u`.`full_name` AS `full_name`,`f`.`id` AS `form_id`,`f`.`title` AS `form_title`,`fr`.`submitted_at` AS `submitted_at`,`fr`.`status_id` AS `status_id`,`st`.`name` AS `response_status`,count(`ra`.`id`) AS `answered_questions`,case when `fr`.`manual_signature_key` is not null then \'Firmado\' else \'No firmado\' end AS `signature_status` from ((((`nokto_db`.`users` `u` join `nokto_db`.`form_responses` `fr` on(`u`.`id` = `fr`.`user_id`)) join `nokto_db`.`forms` `f` on(`fr`.`form_id` = `f`.`id`)) join `nokto_db`.`status_types` `st` on(`fr`.`status_id` = `st`.`id`)) left join `nokto_db`.`response_answers` `ra` on(`fr`.`id` = `ra`.`response_id`)) group by `fr`.`id`
mariadb-version=100621
