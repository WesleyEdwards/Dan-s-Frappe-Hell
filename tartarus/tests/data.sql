-- Insert Test Drinks
INSERT INTO MenuItem (Name, Recipe, Price, Active, ImagePath)
Values ('Inactive', '{"1":1}',0.0,FALSE,'');
INSERT INTO MenuItem (Name, Recipe, Price, Active, ImagePath)
Values ('Active', '{"1":100}',0.0,TRUE,'');