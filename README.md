mysql -> chacharentcar-> 실행 안되면 이거 실행하기
SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));
