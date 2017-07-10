CREATE TABLE user_detail (
    uid INT PRIMARY KEY AUTO_INCREMENT,
    fname  VARCHAR(255) NOT NULL,
    lname VARCHAR(255) NOT NULL,
    phone INT(20) NOT NULL,
    email VARCHAR(40) NOT NULL,
    password VARCHAR(255) NOT NULL
     );

CREATE TABLE user_session(
    uid int,
    ID int NOT NULL,
    token int NOT NULL,
    PRIMARY KEY (ID),
    FOREIGN KEY (uid) REFERENCES user_detail(uid)
);


