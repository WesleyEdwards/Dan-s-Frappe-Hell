from tartarus.db import get_db
from tartarus.models.TartarusException import TartarusException
from .Balance import Balance
from enum import Enum
class Ingredient:
    __id = 0
    __name = ""
    __kind = 0
    __price = 0.0
    __stock = 0
    __upcharge = 0.0

    class Kind(Enum):
        MILK=1
        SHOT=2
        COFFEE=3
        FLAVOR=4
        TOPPING=5
        SWEETENER=6
        ADDIN=7
        @classmethod
        def list(cls):
            return list(map(lambda c: c.value, cls))

    def __init__(self, name, kind, price, stock, upcharge, id=0):
        self.__id = id
        self.__name = name
        self.__price = price
        self.__stock = stock
        self.__upcharge = upcharge
        self.__kind = self.convert_kind(kind)

    @classmethod
    def fromID(cls, id):
        """Returns the ingredient corresponding to `id`"""
        db = get_db()
        ingredient = db.execute('SELECT * FROM Ingredients where IngredientId = ?',(int(id),)).fetchone()
        return cls(
            ingredient['Name'],
            ingredient['Kind'],
            ingredient['Price'],
            ingredient['Stock'],
            ingredient['Upcharge'],
            int(id)
        )

    @classmethod
    def ofKind(cls, kind:'str|int|Ingredient.Kind'):
        """
        Returns all ingredients of the kind, `kind`
        """
        db = get_db()
        cur = db.cursor()
        kind = cls.convert_kind(kind).value
        print(type(kind))
        ingredients = cur.execute(f"SELECT * FROM Ingredients where Kind = ?",(cls.convert_kind(kind).value,)).fetchall()
        return [cls(x['Name'],x['Kind'],x['Price'],x['Stock'],x['Upcharge'],x['IngredientId']) for x in ingredients]

    @classmethod
    def ofAll(cls):
        """Returns all ingredients"""
        db = get_db()
        cur = db.cursor()
        ingredients = cur.execute("SELECT * FROM Ingredients").fetchall()
        return [cls(x['Name'],x['Kind'],x['Price'],x['Stock'],x['Upcharge'],x['IngredientId']) for x in ingredients]

    def addToDatabase(self):
        db = get_db()
        cur = db.cursor()
        cur.execute(f"insert into Ingredients(name, kind, price, stock, upcharge) values ('{self.getName()}', '{self.getKind().value}', '{self.getPrice()}','{self.getStock()}','{self.getUpcharge()}')")
        db.commit()
        self.__id = db.execute('SELECT * FROM Ingredients where Name = ?',(self.getName(),)).fetchone()['IngredientId']
        

        
    
    def getId(self):
        return self.__id
    def getName(self):
        return self.__name
    def getKind(self):
        return self.__kind
    def getPrice(self):
        return self.__price
    def getStock(self):
        return self.__stock
    def getUpcharge(self):
        return self.__upcharge

    def getJson(self):
        return {
            'IngredientId':self.getId(), 
            'Name':self.getName(), 
            'Kind':self.getKind().name,
            'Price':self.getPrice(),
            'Stock':self.getStock(),
            'Upcharge':self.getUpcharge()
        }

    def setName(self, name:str):
        if self.__name != name:
            self.__name = name
            db = get_db()
            cur = db.cursor()
            cur.execute(f"UPDATE Ingredients SET Name = '{name}' WHERE IngredientId = {self.getId()}")
            cur.close()
            db.commit()

    def setKind(self, kind:'str|int|Kind'):
        kind = self.convert_kind(kind)
        if self.__kind != kind:
            self.__kind = kind
            db = get_db()
            cur = db.cursor()
            cur.execute(f"UPDATE Ingredients SET kind = {kind.value} WHERE IngredientId = {self.getId()}")
            cur.close()
            db.commit()

    def setPrice(self, price:float):
        if self.__price != price:
            self.__price = price
            db = get_db()
            cur = db.cursor()
            cur.execute(f"UPDATE Ingredients SET price = {price} WHERE IngredientId = {self.getId()}")
            cur.close()
            db.commit()

    def setStock(self, stock:int, Purchasing=True):
        """Sets the stock, deducts from store balance if Purchasing == True"""
        if self.__stock != stock:
            if stock < 0:
                raise TartarusException("Cannot reduce Quantity Below 0")
            change = stock - self.__stock
            balance = Balance.getStoreBalance()
            if Purchasing:
                if change > 0:
                    balance.decrement_balance(change * self.getPrice())
                else:
                    balance.increment_balance(abs(change * self.setPrice()))
            self.__stock = stock
            db = get_db()
            cur = db.cursor()
            cur.execute(f"UPDATE Ingredients SET stock = {stock} WHERE IngredientId = {self.getId()}")
            cur.close()
            db.commit()

    def setUpcharge(self, upcharge:float):
        if self.__upcharge != upcharge:
            self.__upcharge = upcharge
            db = get_db()
            cur = db.cursor()
            cur.execute(f"UPDATE Ingredients SET upcharge = {upcharge} WHERE IngredientId = {self.getId()}")
            cur.close()
            db.commit()

    def canFulfill(self, qty:int) -> bool:
        """Checks to see if there is enough stock of an ingredient to meet the demand"""
        return self.getStock() >= abs(qty)
    
    def subtractQuantity(self, qty:int) -> bool:
        """Subtracts the quantity of the ingredient from the store"""            
        self.setStock(self.getStock() - abs(qty), Purchasing=False)
        return True


    @staticmethod
    def convert_kind( kind: 'str|int|Kind') -> Kind:
        """Converts parameter into a Kind enum"""
        if type(kind) == str:
            return Ingredient.Kind[kind]
        elif type(kind) == int:
            return Ingredient.Kind(kind)
        elif type(kind) == Ingredient.Kind:
            return kind
        else:
            raise TypeError(f"Cannot convert {type(kind)} to Ingredient.Kind")