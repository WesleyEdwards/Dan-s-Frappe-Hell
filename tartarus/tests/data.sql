-- Insert Test Drinks
INSERT INTO MenuItem (Name, Recipe, Price, Active, ImagePath)
Values ('Inactive', '{"1":1}',0.0,FALSE,'');
INSERT INTO MenuItem (Name, Recipe, Price, Active, ImagePath)
Values ('Active', '{"1":100}',0.0,TRUE,'');

-- Insert Test Order
INSERT INTO Orders (UserId, OrderDate, Items, TotalPrice, Status, Favorite)
Values (1, '20220204 10:34:09 AM', '{"1":{"quantity":1,"price":0}}',0,1,TRUE)