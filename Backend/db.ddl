CREATE TABLE application_info (
  app_info_uid integer PRIMARY KEY AUTO_INCREMENT,
  app_info_description varchar(3) NOT NULL,

  // Audit
  created_at timestamp NOT NULL,
  created_by varchar(255) NOT NULL,
  modified_at timestamp,
  modified_by varchar(255)
);

CREATE TABLE server_info (
  server_info_uid integer PRIMARY KEY AUTO_INCREMENT,
  app_info_uid integer NOT NULL,
  source_hostname varchar(255),
  source_ip_address varchar(255),
  destination_hostname varchar(255),
  destination_ip_address varchar(255),
  destination_port int,
  ip_status BOOLEAN NOT NULL DEFAULT TRUE,

  // Audit
  created_at timestamp NOT NULL,
  created_by varchar(255) NOT NULL,
  modified_at timestamp,
  modified_by varchar(255)
);

CREATE TABLE user (
  user_uid integer PRIMARY KEY AUTO_INCREMENT,
  user_id varchar(255) NOT NULL,
  user_password varchar(255) NOT NULL,
  user_role int NOT NULL,

  // Audit
  created_at timestamp NOT NULL,
  created_by varchar(255) NOT NULL,
  modified_at timestamp,
  modified_by varchar(255)
);

CREATE TABLE user_apps (
  user_apps_uid integer PRIMARY KEY AUTO_INCREMENT,
  user_uid integer NOT NULL,
  app_info_uid integer NOT NULL,

  // Audit
  created_at timestamp NOT NULL,
  created_by varchar(255) NOT NULL,
  modified_at timestamp,
  modified_by varchar(255)
);

ALTER TABLE server_info ADD FOREIGN KEY (app_info_uid) REFERENCES application_info (app_info_uid);

ALTER TABLE user_apps ADD FOREIGN KEY (user_uid) REFERENCES user (user_uid);

ALTER TABLE user_apps ADD FOREIGN KEY (app_info_uid) REFERENCES application_info (app_info_uid);
