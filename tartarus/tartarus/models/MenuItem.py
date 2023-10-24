import json
from tartarus.db import get_db
from tartarus.models.Ingredient import Ingredient
class MenuItem:
    __id = 0
    __name = ""
    __recipe = {}
    __price = 0.0
    __active = False
    __imagepath = ""


    def __init__(self, name:str, recipe:'dict|str', active=False, imagepath="", id=0):
        self.__id = id
        self.__name = name
        if type(recipe) == str:
            recipe = json.loads(recipe)
        self.__price = self.calculate_price(recipe)
        self.__recipe = recipe
        self.__active = active
        self.__imagepath = imagepath

    @classmethod
    def fromID(cls, id):
        """Returns the menu item corresponding to `id`"""
        db = get_db()
        item = db.execute('SELECT * FROM MenuItem where MenuId = ?',(id,)).fetchone()
        return cls(
            item['Name'],
            json.loads(item['Recipe']),
            item['Active'],
            item['ImagePath'],
            id
        )

    @classmethod
    def fromRecipe(cls, recipe:'dict|str'):
        """
        Returns the menu item matching `recipe`
        If a menu item does not exist, one is created and returned
        """
        if type(recipe) == dict:
            recipe_str = json.dumps(recipe)
            recipe_json = recipe
        elif type(recipe) == str:
            recipe_str = recipe
            recipe_json = json.loads(recipe)
        else:
            raise TypeError(f"Cannot convert type: {type(recipe)} to recipe")
        
        db = get_db()
        cur = db.cursor()
        
        item = cur.execute(f"SELECT * FROM MenuItem where Recipe = ?",(recipe_str,)).fetchone()

        if item: # Drink is found
            return cls(
                item['Name'],
                recipe_json,
                item['Active'],
                item['ImagePath'],
                item['MenuId']
            )
        else: # Drink not found, let's create it
            newItem = cls(
                cls.name_from_recipe(recipe_json),
                recipe_json,
                imagepath=cls.imagepath_from_recipe(recipe_json),

            )
            newItem.addToDatabase()
            return newItem

    @classmethod
    def ofActive(cls):
        """Returns all 'Active' menu items"""
        db = get_db()
        cur = db.cursor()
        items = cur.execute("SELECT * FROM MenuItem where Active = ?",(True,)).fetchall()
        return [cls(x['Name'],x['Recipe'],x['Active'],x['ImagePath'],x['MenuId']) for x in items]

    @classmethod
    def ofAll(cls):
        """Returns all MenuItems"""
        db = get_db()
        cur = db.cursor()
        items = cur.execute("SELECT * FROM MenuItem").fetchall()
        return [cls(x['Name'],x['Recipe'],x['Active'],x['ImagePath'],x['MenuId']) for x in items]

    def addToDatabase(self):
        db = get_db()
        cur = db.cursor()
        cur.execute(f"insert into MenuItem(name, recipe, price, active, imagepath) values ('{self.getName()}', '{json.dumps(self.getRecipe())}', '{self.getPrice()}','{self.getActive()}','{self.getImagePath()}')")
        db.commit()
        self.__id = db.execute('SELECT * FROM MenuItem where Recipe = ?',(json.dumps(self.getRecipe()),)).fetchone()['MenuId']
        

    def setActive(self,active:bool):
        if not active == self.__active:
            self.__active = active
            db = get_db()
            cur = db.cursor()
            cur.execute(f"UPDATE MenuItem SET active = {active} WHERE MenuId = {self.getId()}")
            cur.close()
            db.commit()
    
    def setImagePath(self, imagepath:str):
        if not imagepath == self.__imagepath:
            self.__imagepath = imagepath
            db = get_db()
            cur = db.cursor()
            cur.execute(f"UPDATE MenuItem SET imagepath = {imagepath} WHERE MenuId = {self.getId()}")
            cur.close()
            db.commit()

    def setName(self, name:str):
        if not name == self.__name:
            self.__name = name
            db = get_db()
            cur = db.cursor()
            cur.execute(f"UPDATE MenuItem SET name = '{name}' WHERE MenuId = {self.getId()}")
            cur.close()
            db.commit()
    
    def getId(self):
        return int(self.__id)
    def getName(self):
        return self.__name
    def getRecipe(self):
        return self.__recipe
    def getPrice(self):
        return self.__price
    def getActive(self):
        return self.__active
    def getImagePath(self):
        return self.__imagepath

    def canFulfill(self, qty) -> bool:
        """Returns true if has enough stock to fulfill the amount of drinks"""
        for k in self.getRecipe():
            ing = Ingredient.fromID(k)
            if not ing.canFulfill(self.getRecipe()[k]*abs(qty)):
                return False
        return True
    
    def subtractQuantity(self, qty) -> bool:
        """Subtracts the qty of each ingredient from store and returns true"""
        for k in self.getRecipe():
            ing = Ingredient.fromID(k)
            ing.subtractQuantity(self.getRecipe()[k]*abs(qty))
        return True

    def getJson(self):
        """Returns dictionary representation of MenuItem"""
        return {
            'MenuId':self.getId(),
            'Name':self.getName(),
            'Recipe':self.getRecipe(),
            'Price':self.getPrice(),
            'Active':self.getActive(),
            'ImagePath':self.getImagePath()
        }
    @staticmethod
    def calculate_price(recipe:dict) -> float:
        """Calculates the price of a drink (Base + cost of ingredients"""
        BASEPRICE = 1.00
        price = BASEPRICE
        for key in recipe:
            ing = Ingredient.fromID(key)
            price += (ing.getUpcharge() * recipe[key])
        return round(price,2)

        

    @staticmethod
    def imagepath_from_recipe(recipe:dict) -> str:
        """
        Chooses a default image to represent a drink from a recipe.
        """
        if recipe.get("6",0) > 0:
            return "https://user-images.githubusercontent.com/97990557/277696831-b9358428-b5e2-4464-80cd-1cd6fd5b220b.png"
        elif recipe.get("12",0) > 0:
            return "https://user-images.githubusercontent.com/97990557/277696831-b9358428-b5e2-4464-80cd-1cd6fd5b220b.png"
        elif recipe.get("7",0) > 0:
            return "https://user-images.githubusercontent.com/97990557/277696831-b9358428-b5e2-4464-80cd-1cd6fd5b220b.png"
        elif recipe.get("9",0) > 0:
            return "https://user-images.githubusercontent.com/97990557/277696831-b9358428-b5e2-4464-80cd-1cd6fd5b220b.png"
        else:
            return "https://user-images.githubusercontent.com/97990557/277696831-b9358428-b5e2-4464-80cd-1cd6fd5b220b.png"

    @staticmethod
    def name_from_recipe(recipe:dict) -> str:
        """
        Generates a default name to represent a drink from a recipe.

        Follows this format: "`<milk>` creme|blended [-`<flavor>`] Frappeccino [with light| |heavy `<addin>`|`<shot>` [and]]"
        """

        milk = ""
        shots = {}
        flavors = []
        coffee = False
        addins = {}

        # Split up parts of recipe
        for key in recipe:
            ing = Ingredient.fromID(key)
            kind = ing.getKind()
            if kind.name == "MILK":
                milk = kind.name
            elif kind.name == "SHOT":
                shots[ing.getName()] = recipe[key]
            elif kind.name == "COFFEE":
                coffee = True
            elif kind == "FLAVOR":
                flavors.append(ing.getName())
            elif kind == "ADDIN":
                addins[ing.getName()] == recipe[key]
        
        # Choose milk type
        name = milk + " blended" if coffee else " cream"
        # Add flavors
        for flavor in flavors:
            name += "-"+flavor
        name += " Frappuccino"

        # Add extras
        num_extras = len(shots) + len(addins)
        if num_extras > 0:
            name += " with"
        for addin in addins:
            prefix = " "
            if addins[addin] == 1:
                prefix = " light"
            if addins[addin] > 2:
                prefix = " heavy"
            name += f"{prefix} {addin}"
            num_extras -= 1
            if num_extras > 0:
                name += " and"

        for shot in shots:
            prefix = " "
            if shots[shot] == 1:
                prefix = " light"
            if shots[shot] > 2:
                prefix = " heavy"
            name += f"{prefix} {shot}"
            num_extras -= 1
            if num_extras > 0:
                name += " and"
        
        return name