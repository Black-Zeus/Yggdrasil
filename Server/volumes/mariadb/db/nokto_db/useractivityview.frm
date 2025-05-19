TYPE=VIEW
query=select `u`.`id` AS `user_id`,`u`.`full_name` AS `full_name`,`u`.`email` AS `email`,max(`fal`.`created_at`) AS `last_activity`,count(distinct `fal`.`form_id`) AS `forms_interacted` from (`nokto_db`.`users` `u` left join `nokto_db`.`form_audit_log` `fal` on(`u`.`id` = `fal`.`user_id`)) group by `u`.`id`
md5=d6260d2ac39f9b246639d0b8060d726c
updatable=0
algorithm=0
definer_user=root
definer_host=localhost
suid=2
with_check_option=0
timestamp=0001747614996303299
create-version=2
source=SELECT \n    u.id as user_id,\n    u.full_name,\n    u.email,\n    MAX(fal.created_at) as last_activity,\n    COUNT(DISTINCT fal.form_id) as forms_interacted\nFROM users u\nLEFT JOIN form_audit_log fal ON u.id = fal.user_id\nGROUP BY u.id
client_cs_name=utf8mb3
connection_cl_name=utf8mb3_general_ci
view_body_utf8=select `u`.`id` AS `user_id`,`u`.`full_name` AS `full_name`,`u`.`email` AS `email`,max(`fal`.`created_at`) AS `last_activity`,count(distinct `fal`.`form_id`) AS `forms_interacted` from (`nokto_db`.`users` `u` left join `nokto_db`.`form_audit_log` `fal` on(`u`.`id` = `fal`.`user_id`)) group by `u`.`id`
mariadb-version=100621
