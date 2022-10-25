from datetime import datetime
import json
from tartarus.db import get_db
from enum import Enum

from tartarus.models.MenuItem import MenuItem
from tartarus.models.TartarusException import TartarusException
from tartarus.models.User import User, getUserById
class Order:
    class Status(Enum):
        CART=1
        PLACED=2
        FINISHED=3
        FULFILLED=4

        @classmethod
        def list(cls):
            return list(map(lambda c: c.value, cls))
    __id = -1
    __userId = -1
    __orderDate = datetime.now()
    __items = []
    __totalPrice = 0.0
    __status = Status.CART
    __favorite = False

    def __init__(self, userId:int, orderDate:datetime, items:'list[dict]|str', totalPrice:float, status:'int|str|Status', favorite=False, id=0):
        self.__id = id
        self.__userId = userId
        self.__orderDate = orderDate
        if type(items) == str:
            items = json.loads(items)
        self.__items = items
        self.__totalPrice = totalPrice
        self.__status = self.convert_status(status)
        self.__favorite = favorite

    @classmethod
    def fromID(cls, id=0):
        """Returns the order corresponding to `id`"""
        db = get_db()
        order = db.execute('SELECT * FROM Orders where OrderId = ?',(int(id),)).fetchone()
        if not order:
            return order
        return cls(
            order['UserId'],
            order['OrderDate'],
            order['Items'],
            order['TotalPrice'],
            order['Status'],
            order['Favorite'],
            int(id)
        )

    @classmethod
    def ofUserCart(cls, userId):
        """Returns the user's cart (order status = 0)"""
        db = get_db()
        order = db.execute('SELECT * FROM Orders where userId = ? AND Status= ?',(int(userId),cls.Status.CART.value,)).fetchone()
        if order == None:
            if getUserById(userId) == None:
                raise TartarusException("Invalid user")
            order = cls(userId, datetime.utcnow(), [], 0, cls.Status.CART)
            order.addToDatabase()
            return order
        return cls(order['UserId'],order['OrderDate'],order['Items'],order['TotalPrice'],order['Status'],order['Favorite'],order['OrderId'])

    @classmethod
    def ofUser(cls, userId):
        """Returns all orders belonging to a user"""
        db = get_db()
        orders = db.execute('SELECT * FROM Orders where userId = ?',(int(userId),)).fetchall()
        return [cls(x['UserId'],x['OrderDate'],x['Items'],x['TotalPrice'],x['Status'],x['Favorite'],x['OrderId']) for x in orders]

    @classmethod
    def ofUserFavorite(cls, userId):
        """Returns all favorited orders belonging to a user"""
        db = get_db()
        orders = db.execute('SELECT * FROM Orders where userId = ? AND Favorite= ?',(int(userId),True,)).fetchall()
        return [cls(x['UserId'],x['OrderDate'],x['Items'],x['TotalPrice'],x['Status'],x['Favorite'],x['OrderId']) for x in orders]

    @classmethod
    def ofStatus(cls, status:'str|int|Status'):
        """
        Returns all Orders of the status, `status`
        """
        db = get_db()
        cur = db.cursor()
        orders = cur.execute(f"SELECT * FROM Orders where Status = ?",(cls.convert_status(status).value,)).fetchall()
        return [cls(x['UserId'],x['OrderDate'],x['Items'],x['TotalPrice'],x['Status'],x['Favorite'],x['OrderId']) for x in orders]

    @classmethod
    def ofAll(cls):
        """Returns all orders"""
        db = get_db()
        cur = db.cursor()
        orders = cur.execute(f"SELECT * FROM Orders").fetchall()
        return [cls(x['UserId'],x['OrderDate'],x['Items'],x['TotalPrice'],x['Status'],x['Favorite'],x['OrderId']) for x in orders]

    def addToDatabase(self):
        db = get_db()
        cur = db.cursor()
        cur.execute(f"insert into Orders(userid, orderdate, items, totalprice, status, favorite) values ('{self.getUserId()}', '{self.getOrderDate()}', '{json.dumps(self.getItems())}','{self.getTotalPrice()}','{self.getStatus().value}','{self.getFavorite()}')")
        db.commit()
        self.__id = db.execute('SELECT * FROM Orders where orderdate = ?',(self.getOrderDate(),)).fetchone()['OrderId']
        

        
    def getJson(self):
        return {
            "OrderId":self.getId(),
            "UserId":self.getUserId(),
            "Favorite":self.getFavorite(),
            "Items":self.getItems(),
            "OrderDate":self.getOrderDate(),
            "Status":self.getStatus().name,
            "TotalPrice":self.getTotalPrice()
        }
    def getId(self):
        return self.__id
    def getUserId(self):
        return self.__userId
    def getFavorite(self):
        return self.__favorite
    def getItems(self):
        return self.__items
    def getOrderDate(self):
        return self.__orderDate
    def getStatus(self):
        return self.__status
    def getTotalPrice(self):
        return self.__totalPrice

    def setUserId(self, id:int):
        if not id == self.__userId:
            self.__userId = id
            db = get_db()
            cur = db.cursor()
            cur.execute(f"UPDATE Orders SET userId = {id} WHERE OrderId = {self.getId()}")
            cur.close()
            db.commit()
    
    def setFavorite(self, favorite:bool):
        if not favorite == self.__favorite:
            self.__favorite = favorite
            db = get_db()
            cur = db.cursor()
            cur.execute(f"UPDATE Orders SET favorite = {favorite} WHERE OrderId = {self.getId()}")
            cur.close()
            db.commit()

    def setItems(self, items:dict):
        """
        Sets the items of an order, 
        can only be done if the order has not been placed (in cart)
        Also updates total price of order
        """
        if not items == self.__items:
            if self.getStatus().value > 1:
                raise TartarusException("Cannot edit items after order has been placed")
            items = self.__validateItems(items)
            self.__items = items
            self.__totalPrice = self.__calculateTotalPrice()
            db = get_db()
            cur = db.cursor()
            print(type(self.getId()))
            res = cur.execute(f"UPDATE Orders SET items = ?, totalPrice = ?",(json.dumps(items),self.__totalPrice, )).fetchall()
            item = cur.execute(f"SELECT * FROM Orders where OrderId = ?", (self.getId(),)).fetchone()
            cur.close()
            db.commit()

    def setStatus(self, status:'Status|str|int'):
        """
        Sets the order status,
        Status must increase linearly through steps, i.e:
            CART -> PLACED -> FINISHED -> FULFILLED
        When moved from CART to PLACED, price is calculated, set in stone, and saved to the database. OrderDate is also set.
        """
        status = self.convert_status(status)
        if self.__status != status:
            if status.value -1 != self.__status.value:
                raise ValueError(f"Cannot increment status from {self.__status} to {status}")
            self.__status = status
            db = get_db()
            cur = db.cursor()
            if status in (self.Status.PLACED, self.Status.CART): # Lock in Price and orderDate
                self.__items = self.__validateItems(self.__items)
                cur.execute(f"UPDATE Orders SET items = '{json.dumps(self.__items)}' WHERE OrderId = {self.getId()}")
                self.__orderDate = datetime.utcnow()
                cur.execute(f"UPDATE Orders SET orderDate = ? WHERE OrderId = {self.getId()}",(self.__orderDate,))
                self.__totalPrice = self.__calculateTotalPrice()
                cur.execute(f"UPDATE Orders SET totalPrice = {self.__totalPrice} WHERE OrderId = {self.getId()}")
            cur.execute(f"UPDATE Orders SET status = {status.value} WHERE OrderId = {self.getId()}")
            cur.close()
            db.commit()

    def __calculateTotalPrice(self):
        """Goes through and gets the price of each MenuItem in the order, and returns the total + tax"""
        TAX = 0.07
        subtotal = 0
        print(self.__items)
        for item in self.__items:
            subtotal += item["price"] * item["quantity"]
        return round(subtotal + subtotal * TAX,2)

    def __validateItems(self, items):
        """
        Method to ensure that the items dictionary is valid, and update the prices.
        Valid item dictionaries follow this format: 
        {
            ingredientid: {"price":<float>, "quantity":<int>}
        }
        """
        print(items)
        for item in items:
            if None in (item.get("price"), item.get("quantity"), item.get("menuId")):
                raise TartarusException("Items list formatted incorrectly. See Tartarus api doc for proper format")
            itemObj = MenuItem.fromID(item.get("menuId"))
            item["price"] = itemObj.calculate_price(itemObj.getRecipe())
            if item["quantity"] < 0:
                item["quantity"] = 0
        return items

    @staticmethod
    def convert_status( status: 'str|int|Status') -> Status:
        """Converts parameter into a status enum"""
        if type(status) == str:
            return Order.Status[status]
        elif type(status) == int:
            return Order.Status(status)
        elif type(status) == Order.Status:
            return status
        else:
            raise TypeError(f"Cannot convert {type(status)} to Order.Status")