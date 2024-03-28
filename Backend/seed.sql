-- Test data keys:
-- Applications 1xx
-- Servers 2xx
-- Users 3xx
-- User Apps 4xx

-- Note they are just used for being distinct, all ids could just be 1,2,3, etc.
-- but im using +100 for each type

-- Clear data so no duplicates
DELETE FROM USER_APPS;
DELETE FROM APPLICATION_INFO;
DELETE FROM SERVER_INFO;
DELETE FROM "user";

INSERT INTO application_info (APP_INFO_UID, APP_INFO_DESCRIPTION, CREATED_AT, CREATED_BY) VALUES
    (1, 'ABC', NOW(), 'Script'),
    (2, 'XYZ', NOW(), 'Script');

-- Inserting sample data into server_info table
INSERT INTO server_info (SERVER_INFO_UID, APP_INFO_ID, SOURCE_HOSTNAME, SOURCE_IP_ADDRESS, DESTINATION_HOSTNAME, DESTINATION_IP_ADDRESS, DESTINATION_PORT, IP_STATUS, CREATED_AT, CREATED_BY) VALUES
    (200, 1, 'Source1', '192.168.1.1', 'Destination1', '10.0.0.1', 8080, TRUE, NOW(), 'Script'),
    (201, 2, 'Source2', '192.168.1.2', 'Destination2', '10.0.0.2', 8080, TRUE, NOW(), 'Script');

-- Inserting sample data into user table
INSERT INTO "user" (USER_UID, USER_ID, USER_PASSWORD, USER_ROLE, CREATED_AT, CREATED_BY) VALUES
    (300, 'user', 'password', 0, NOW(), 'Script'),
    (301, 'admin', 'password', 1, NOW(), 'Script');

-- Inserting sample data into user_apps table
INSERT INTO user_apps (USER_APPS_UID, USER_UID, APP_INFO_UID, CREATED_AT, CREATED_BY) VALUES
    (400, 300, 1, NOW(), 'Script'), -- Assigning App1 to User
    (401,301, 2, NOW(), 'Script'); -- Assigning App2 to Admin
