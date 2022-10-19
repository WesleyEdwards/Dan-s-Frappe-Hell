from tartarus.db import get_db
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
            return list(map(lambda c: c.value,cls))

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
        cur.execute(f"insert into Ingredients(name, kind, price, stock, upcharge) values ('{self.getName()}', '{self.getKind().value}', '{self.getPrice()}','{self.getStock()}','{self.getUpcharge}')")
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