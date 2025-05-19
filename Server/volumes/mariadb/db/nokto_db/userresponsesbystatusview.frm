TYPE=VIEW
query=select `u`.`id` AS `user_id`,`st`.`name` AS `status_name`,count(distinct `fr`.`id`) AS `responses` from ((((`nokto_db`.`users` `u` join `nokto_db`.`form_permissions` `fp` on(`u`.`id` = `fp`.`user_id`)) join `nokto_db`.`forms` `f` on(`fp`.`form_id` = `f`.`id`)) left join `nokto_db`.`form_responses` `fr` on(`f`.`id` = `fr`.`form_id` and `u`.`id` = `fr`.`user_id`)) left join `nokto_db`.`status_types` `st` on(`fr`.`status_id` = `st`.`id`)) group by `u`.`id`,`st`.`name`
md5=491f157b00b587fc70bc0403210b40cd
updatable=0
algorithm=0
definer_user=root
definer_host=localhost
suid=2
with_check_option=0
timestamp=0001747614996450589
create-version=2
source=SELECT u.id as user_id,\n       st.name as status_name,\n       COUNT(DISTINCT fr.id) as responses\nFROM users u\nJOIN form_permissions fp ON u.id = fp.user_id\nJOIN forms f ON fp.form_id = f.id\nLEFT JOIN form_responses fr ON f.id = fr.form_id AND u.id = fr.user_id\nLEFT JOIN status_types st ON fr.status_id = st.id\nGROUP BY u.id, st.name
client_cs_name=utf8mb3
connection_cl_name=utf8mb3_general_ci
view_body_utf8=select `u`.`id` AS `user_id`,`st`.`name` AS `status_name`,count(distinct `fr`.`id`) AS `responses` from ((((`nokto_db`.`users` `u` join `nokto_db`.`form_permissions` `fp` on(`u`.`id` = `fp`.`user_id`)) join `nokto_db`.`forms` `f` on(`fp`.`form_id` = `f`.`id`)) left join `nokto_db`.`form_responses` `fr` on(`f`.`id` = `fr`.`form_id` and `u`.`id` = `fr`.`user_id`)) left join `nokto_db`.`status_types` `st` on(`fr`.`status_id` = `st`.`id`)) group by `u`.`id`,`st`.`name`
mariadb-version=100621
