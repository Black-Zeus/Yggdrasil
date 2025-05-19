TYPE=VIEW
query=select `c`.`id` AS `category_id`,`c`.`name` AS `category_name`,`sc`.`id` AS `subcategory_id`,`sc`.`name` AS `subcategory_name`,count(distinct `f`.`id`) AS `total_forms`,count(distinct case when `f`.`status_id` = (select `nokto_db`.`status_types`.`id` from `nokto_db`.`status_types` where `nokto_db`.`status_types`.`code` = \'published\') then `f`.`id` end) AS `active_forms`,count(distinct `fr`.`id`) AS `total_responses`,count(distinct `fr`.`user_id`) AS `unique_respondents` from (((`nokto_db`.`categories` `c` left join `nokto_db`.`subcategories` `sc` on(`c`.`id` = `sc`.`category_id`)) left join `nokto_db`.`forms` `f` on(`c`.`id` = `f`.`category_id` or `sc`.`id` = `f`.`subcategory_id`)) left join `nokto_db`.`form_responses` `fr` on(`f`.`id` = `fr`.`form_id`)) group by `c`.`id`,`sc`.`id`
md5=97ea3e3b8641c2d2b6972193c40dc975
updatable=0
algorithm=0
definer_user=root
definer_host=localhost
suid=2
with_check_option=0
timestamp=0001747614996318437
create-version=2
source=SELECT c.id as category_id,\n    c.name as category_name,\n    sc.id as subcategory_id,\n    sc.name as subcategory_name,\n    COUNT(DISTINCT f.id) as total_forms,\n    COUNT(\n        DISTINCT CASE\n            WHEN f.status_id = (\n                SELECT id\n                FROM status_types\n                WHERE code = \'published\'\n            ) THEN f.id\n        END\n    ) as active_forms,\n    COUNT(DISTINCT fr.id) as total_responses,\n    COUNT(DISTINCT fr.user_id) as unique_respondents\nFROM categories c\n    LEFT JOIN subcategories sc ON c.id = sc.category_id\n    LEFT JOIN forms f ON c.id = f.category_id\n    OR sc.id = f.subcategory_id\n    LEFT JOIN form_responses fr ON f.id = fr.form_id\nGROUP BY c.id,\n    sc.id
client_cs_name=utf8mb3
connection_cl_name=utf8mb3_general_ci
view_body_utf8=select `c`.`id` AS `category_id`,`c`.`name` AS `category_name`,`sc`.`id` AS `subcategory_id`,`sc`.`name` AS `subcategory_name`,count(distinct `f`.`id`) AS `total_forms`,count(distinct case when `f`.`status_id` = (select `nokto_db`.`status_types`.`id` from `nokto_db`.`status_types` where `nokto_db`.`status_types`.`code` = \'published\') then `f`.`id` end) AS `active_forms`,count(distinct `fr`.`id`) AS `total_responses`,count(distinct `fr`.`user_id`) AS `unique_respondents` from (((`nokto_db`.`categories` `c` left join `nokto_db`.`subcategories` `sc` on(`c`.`id` = `sc`.`category_id`)) left join `nokto_db`.`forms` `f` on(`c`.`id` = `f`.`category_id` or `sc`.`id` = `f`.`subcategory_id`)) left join `nokto_db`.`form_responses` `fr` on(`f`.`id` = `fr`.`form_id`)) group by `c`.`id`,`sc`.`id`
mariadb-version=100621
