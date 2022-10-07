DROP TABLE IF EXISTS users;

CREATE TABLE Users(
    UserId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    FirstName TEXT NOT NULL,
    LastName TEXT NOT NULL,
    password TEXT NOT NULL, 
    PermissionLevel INTEGER NOT NULL
);

DROP TABLE IF EXISTS Employees;

CREATE TABLE Employees(
    EmployeeId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    UserId INTEGER NOT NULL, 
    PayRate NUMERIC NOT NULL,
    HireDate DATETIME NOT NULL,
    HoursWorked NUMERIC NOT NULL,
    FOREIGN KEY(UserId) REFERENCES Users(UserId)
);

DROP TABLE IF EXISTS WorkLog;

/*CREATE TABLE WorkLog(
    WorkLogId INTEGER NOT NULL,
    UserId INTEGER NOT NULL, 
    StartDate DATETIME NOT NULL,
    EndDate DATETIME NOT NULL,
    HoursWorked NUMERIC NOT NULL,
    TotalPaid NUMERIC NOT NULL,
    FOREIGN KEY(UserId) REFERENCES Users(UserId)
);*/

DROP TABLE IF EXISTS Balances;

CREATE TABLE Balances(
    BalanceId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    UserId INTEGER NOT NULL,
    CurrentBalance NUMERIC NOT NULL
);

INSERT INTO Balances (UserId, CurrentBalance) VALUES (-1, 10000.00); --SET UP INITIAL STORE BALANCE

DROP TABLE IF EXISTS BalanceAudit;

CREATE TABLE BalanceAudit(
    BalanceAuditId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    BalanceId INTEGER NOT NULL,
    OldBalance NUMERIC NOT NULL, 
    NewBalance NUMERIC NOT NULL,
    TransactionType TEXT NOT NULL,
    AuditDate DATETIME NOT NULL,
    FOREIGN KEY(BalanceId) REFERENCES Balances(BalanceId)
);

INSERT INTO BalanceAudit (BalanceId, OldBalance, NewBalance, TransactionType, AuditDate)
VALUES ((select balanceId from Balances where UserId = -1), 0.00, 10000.00, 'INIT', DATETIME('now')); --LOG INITIAL BALANCE

DROP TABLE IF EXISTS Ingredients;

CREATE TABLE Ingredients(
    IngredientId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    Name TEXT NOT NULL, 
    Price NUMERIC NOT NULL,
    Stock INTEGER NOT NULL
);

--Insert base ingredient list from Dans menu items

DROP TABLE IF EXISTS MenuItem;

CREATE TABLE MenuItem(
    MenuId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    Name TEXT NOT NULL,
    Recipe TEXT NOT NULL, --Store recipe as JSON: {"20" : "2"} first element is ID from IngredientId second is quantity
    Price NUMERIC NOT NULL, 
    Active BOOL NOT NULL, 
    ImagePath TEXT NOT NULL
);

-- Insert base menu items from Dans menu items

DROP TABLE IF EXISTS Orders;

CREATE TABLE Orders(
    OrderId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    UserId INTEGER NOT NULL,
    OrderDate DATETIME NOT NULL,
    Items TEXT NOT NULL, --Comma delimited string of MenuIds 
    TotalPrice NUMERIC NOT NULL,
    Active BOOL NOT NULL,
    Received BOOL NOT NULL,
    InProgress BOOL NOT NULL,
    Ready BOOL NOT NULL,
    Favourite BOOL NOT NULL,
    FOREIGN KEY(UserId) REFERENCES Users(UserId)
);