/* drop and create the schedule table */

DROP TABLE IF EXISTS schedule;

CREATE TABLE IF NOT EXISTS schedule (
    user_id serial primary key, 
    username varchar(50) not null, 
    day int not null, 
    start_time time, 
    end_time time);