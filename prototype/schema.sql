DROP TABLE IF EXISTS users;

CREATE TABLE users(
    UserId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password TEXT NOT NULL
);

/*DROP TABLE IF EXISTS permissions;

CREATE TABLE permissions(
    PermissionId INTEGER PRIMARY KEY AUTOINCREMENT,
    FOREIGN KEY(UserId) REFERENCES users(UserId),
    PermissionLevel INTEGER NOT NULL
)
--Other tables */