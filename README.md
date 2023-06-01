mysql -> chacharentcar-> 실행 안되면 이거 실행하기
SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));

mysql -u root -p
show databases;
use chacharentcar_db;
SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));
