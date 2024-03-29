DROP TABLE IF EXISTS Users;

CREATE TABLE Users(
    UserId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    FirstName TEXT NOT NULL,
    LastName TEXT NOT NULL,
    password TEXT NOT NULL, 
    PermissionLevel INTEGER NOT NULL
);

-- Default Manager login: manager@dfh.com, password: password
insert into Users(email, FirstName, LastName, password, PermissionLevel) values ('manager@dfh.com','default', 'manager','pbkdf2:sha256:260000$rKdwVgn05Bq2Uh8h$0f30a3773ac0fe972e6647885c1fdcc227075fe10b15211b46d74990faef8536',4);

DROP TABLE IF EXISTS Employees;

CREATE TABLE Employees(
    EmployeeId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    UserId INTEGER NOT NULL, 
    PayRate NUMERIC NOT NULL,
    HireDate DATETIME NOT NULL,
    HoursWorked NUMERIC NOT NULL,
    FOREIGN KEY(UserId) REFERENCES Users(UserId)
);

insert into Employees(UserId, PayRate, HireDate, HoursWorked) values (1, 66 , '2021-11-05 14:07:46.254885', 0);

DROP TABLE IF EXISTS WorkLog;

CREATE TABLE WorkLog(
    WorkLogId INTEGER NOT NULL,
    UserId INTEGER NOT NULL, 
    StartDate DATETIME NOT NULL,
    EndDate DATETIME NOT NULL,
    HoursWorked NUMERIC NOT NULL,
    TotalPaid NUMERIC NOT NULL,
    FOREIGN KEY(UserId) REFERENCES Users(UserId)
);

DROP TABLE IF EXISTS Balances;

CREATE TABLE Balances(
    BalanceId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    UserId INTEGER NOT NULL,
    CurrentBalance NUMERIC NOT NULL
);

INSERT INTO Balances (UserId, CurrentBalance) VALUES (-1, 10000.00); --SET UP INITIAL STORE BALANCE
INSERT INTO Balances (UserId, CurrentBalance) VALUES (1, 100.00); --SET UP INITIAL MANAGER BALANCE

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
    Kind INTEGER NOT NULL, 
    Price NUMERIC NOT NULL,
    Stock INTEGER NOT NULL,
    Upcharge NUMERIC NOT NULL
);

--Insert base ingredient list from Dans menu items
INSERT INTO Ingredients (Name, Kind, Price, Stock, Upcharge)
VALUES ('Whole Milk',1,0.15,9,0.25);
INSERT INTO Ingredients (Name, Kind, Price, Stock, Upcharge)
VALUES ('Soy Milk',1,0.20,100,0.30);
INSERT INTO Ingredients (Name, Kind, Price, Stock, Upcharge)
VALUES ('Espresso',2,0.55,100,0.75);
INSERT INTO Ingredients (Name, Kind, Price, Stock, Upcharge)
VALUES ('Frappuccino Blend',3,0.10,200,0.12);
INSERT INTO Ingredients (Name, Kind, Price, Stock, Upcharge)
VALUES ('Frappuccino Chips',3,0.13,150,0.15);
INSERT INTO Ingredients (Name, Kind, Price, Stock, Upcharge)
VALUES ('Pumpkin Spice',4,0.25,90,0.30);
INSERT INTO Ingredients (Name, Kind, Price, Stock, Upcharge)
VALUES ('Caramel',4,0.15,100,0.20);
INSERT INTO Ingredients (Name, Kind, Price, Stock, Upcharge)
VALUES ('Whipped Cream',5,0.05,200,0.07);
INSERT INTO Ingredients (Name, Kind, Price, Stock, Upcharge)
VALUES ('Chocolate Drizzle',5,0.08,100,0.10);
INSERT INTO Ingredients (Name, Kind, Price, Stock, Upcharge)
VALUES ('Splenda',6,0.02,100,0.03);
INSERT INTO Ingredients (Name, Kind, Price, Stock, Upcharge)
VALUES ('Sugar',6,0.03,100,0.04);
INSERT INTO Ingredients (Name, Kind, Price, Stock, Upcharge)
VALUES ('Matcha Powder',7,0.55,60,0.65);

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
INSERT INTO MenuItem (Name, Recipe, Price, Active, ImagePath)
Values ('Cerberus Special', '{"1":1,"7":2,"8":1,"11":2}',0.0,TRUE,'https://user-images.githubusercontent.com/97990557/277687838-4a3a7f6c-3d81-4ed5-bf3a-fb8c7dc6dcf8.png');
INSERT INTO MenuItem (Name, Recipe, Price, Active, ImagePath)
Values ('Fire and Brimstone', '{"1":2,"3":4,"6":2,"9":1,"10":2}',0.0,TRUE,'https://user-images.githubusercontent.com/97990557/277691324-452336fb-82b1-490f-b05e-7315562d8bff.png');
INSERT INTO MenuItem (Name, Recipe, Price, Active, ImagePath)
Values ('Green Devil', '{"2":3,"4":4,"5":1,"12":3}',0.0,TRUE,'https://user-images.githubusercontent.com/97990557/277691320-eef7775d-1bb2-4e82-ac8a-dc668e69bf3f.png');
INSERT INTO MenuItem (Name, Recipe, Price, Active, ImagePath)
Values ('Holy Hades', '{"3":1,"4":2,"9":1,"10":2}',0.0,TRUE,'https://user-images.githubusercontent.com/97990557/277691313-d220e382-0ea8-47ad-bdba-57c06bb1b641.png');
INSERT INTO MenuItem (Name, Recipe, Price, Active, ImagePath)
Values ('Tortured Soul', '{"5":1,"3":2,"6":1,"4":2}',0.0,TRUE,'https://user-images.githubusercontent.com/97990557/277691317-bd9344ba-e3f3-4e31-b513-34321d26faca.png');
INSERT INTO MenuItem (Name, Recipe, Price, Active, ImagePath)
Values ('Pain and Suffering', '{"2":3,"3":1,"4":2,"5":4}',0.0,TRUE,'https://user-images.githubusercontent.com/97990557/277691305-1ab7fa1a-9794-4048-9991-743b40115f32.png');
INSERT INTO MenuItem (Name, Recipe, Price, Active, ImagePath)
Values ('Create Your Own', '{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0}',0.0,TRUE,'https://www.starbucks.com/weblx/images/product-placeholder.png');

DROP TABLE IF EXISTS Orders;

CREATE TABLE Orders(
    OrderId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    UserId INTEGER NOT NULL,
    OrderDate DATETIME NOT NULL,
    Items TEXT NOT NULL, --json dictionary of menuids to quantities 
    TotalPrice NUMERIC NOT NULL,
    Status INTEGER NOT NULL,
    Favorite BOOL NOT NULL,
    FOREIGN KEY(UserId) REFERENCES Users(UserId)
);