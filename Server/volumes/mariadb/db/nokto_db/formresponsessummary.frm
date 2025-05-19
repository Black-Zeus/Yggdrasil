TYPE=VIEW
query=select `f`.`id` AS `form_id`,`f`.`title` AS `title`,count(distinct `fr`.`id`) AS `total_responses`,count(distinct `fr`.`user_id`) AS `unique_respondents`,count(distinct case when `fr`.`manual_signature_key` is not null then `fr`.`id` end) AS `signed_responses`,min(`fr`.`submitted_at`) AS `first_response`,max(`fr`.`submitted_at`) AS `last_response`,round(avg(timestampdiff(MINUTE,`fr`.`created_at`,`fr`.`submitted_at`)),2) AS `avg_completion_time_minutes` from (`nokto_db`.`forms` `f` left join `nokto_db`.`form_responses` `fr` on(`f`.`id` = `fr`.`form_id`)) group by `f`.`id`
md5=5e8ad6cac7dec14063d7355fff0f2dbb
updatable=0
algorithm=0
definer_user=root
definer_host=localhost
suid=2
with_check_option=0
timestamp=0001747614996220849
create-version=2
source=SELECT f.id as form_id,\n    f.title,\n    COUNT(DISTINCT fr.id) as total_responses,\n    COUNT(DISTINCT fr.user_id) as unique_respondents,\n    COUNT(\n        DISTINCT CASE\n            WHEN fr.manual_signature_key IS NOT NULL THEN fr.id\n        END\n    ) as signed_responses,\n    MIN(fr.submitted_at) as first_response,\n    MAX(fr.submitted_at) as last_response,\n    ROUND(\n        AVG(\n            TIMESTAMPDIFF(MINUTE, fr.created_at, fr.submitted_at)\n        ),\n        2\n    ) as avg_completion_time_minutes\nFROM forms f\n    LEFT JOIN form_responses fr ON f.id = fr.form_id\nGROUP BY f.id
client_cs_name=utf8mb3
connection_cl_name=utf8mb3_general_ci
view_body_utf8=select `f`.`id` AS `form_id`,`f`.`title` AS `title`,count(distinct `fr`.`id`) AS `total_responses`,count(distinct `fr`.`user_id`) AS `unique_respondents`,count(distinct case when `fr`.`manual_signature_key` is not null then `fr`.`id` end) AS `signed_responses`,min(`fr`.`submitted_at`) AS `first_response`,max(`fr`.`submitted_at`) AS `last_response`,round(avg(timestampdiff(MINUTE,`fr`.`created_at`,`fr`.`submitted_at`)),2) AS `avg_completion_time_minutes` from (`nokto_db`.`forms` `f` left join `nokto_db`.`form_responses` `fr` on(`f`.`id` = `fr`.`form_id`)) group by `f`.`id`
mariadb-version=100621
