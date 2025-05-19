TYPE=VIEW
query=select `u`.`id` AS `user_id`,`u`.`full_name` AS `full_name`,`u`.`email` AS `email`,`f`.`id` AS `form_id`,`f`.`title` AS `form_title`,`pt`.`code` AS `permission_type`,`pt`.`name` AS `permission_name`,`pc`.`code` AS `capability`,`pc`.`name` AS `capability_name`,`ptc`.`value` AS `capability_value`,`fp`.`granted_at` AS `granted_at`,`fp`.`expires_at` AS `expires_at`,`ug`.`full_name` AS `granted_by` from ((((((`nokto_db`.`users` `u` join `nokto_db`.`form_permissions` `fp` on(`u`.`id` = `fp`.`user_id`)) join `nokto_db`.`forms` `f` on(`fp`.`form_id` = `f`.`id`)) join `nokto_db`.`permission_types` `pt` on(`fp`.`permission_type_id` = `pt`.`id`)) join `nokto_db`.`permission_type_capabilities` `ptc` on(`pt`.`id` = `ptc`.`permission_type_id`)) join `nokto_db`.`permission_capabilities` `pc` on(`ptc`.`capability_id` = `pc`.`id`)) join `nokto_db`.`users` `ug` on(`fp`.`granted_by` = `ug`.`id`)) where `fp`.`is_active` = 1
md5=ac3be0d3b615bbd8d6e2b795cb3fa6a1
updatable=1
algorithm=0
definer_user=root
definer_host=localhost
suid=2
with_check_option=0
timestamp=0001747614996112682
create-version=2
source=SELECT u.id as user_id,\n    u.full_name,\n    u.email,\n    f.id as form_id,\n    f.title as form_title,\n    pt.code as permission_type,\n    pt.name as permission_name,\n    pc.code as capability,\n    pc.name as capability_name,\n    ptc.value as capability_value,\n    fp.granted_at,\n    fp.expires_at,\n    ug.full_name as granted_by\nFROM users u\n    JOIN form_permissions fp ON u.id = fp.user_id\n    JOIN forms f ON fp.form_id = f.id\n    JOIN permission_types pt ON fp.permission_type_id = pt.id\n    JOIN permission_type_capabilities ptc ON pt.id = ptc.permission_type_id\n    JOIN permission_capabilities pc ON ptc.capability_id = pc.id\n    JOIN users ug ON fp.granted_by = ug.id\nWHERE fp.is_active = TRUE
client_cs_name=utf8mb3
connection_cl_name=utf8mb3_general_ci
view_body_utf8=select `u`.`id` AS `user_id`,`u`.`full_name` AS `full_name`,`u`.`email` AS `email`,`f`.`id` AS `form_id`,`f`.`title` AS `form_title`,`pt`.`code` AS `permission_type`,`pt`.`name` AS `permission_name`,`pc`.`code` AS `capability`,`pc`.`name` AS `capability_name`,`ptc`.`value` AS `capability_value`,`fp`.`granted_at` AS `granted_at`,`fp`.`expires_at` AS `expires_at`,`ug`.`full_name` AS `granted_by` from ((((((`nokto_db`.`users` `u` join `nokto_db`.`form_permissions` `fp` on(`u`.`id` = `fp`.`user_id`)) join `nokto_db`.`forms` `f` on(`fp`.`form_id` = `f`.`id`)) join `nokto_db`.`permission_types` `pt` on(`fp`.`permission_type_id` = `pt`.`id`)) join `nokto_db`.`permission_type_capabilities` `ptc` on(`pt`.`id` = `ptc`.`permission_type_id`)) join `nokto_db`.`permission_capabilities` `pc` on(`ptc`.`capability_id` = `pc`.`id`)) join `nokto_db`.`users` `ug` on(`fp`.`granted_by` = `ug`.`id`)) where `fp`.`is_active` = 1
mariadb-version=100621
