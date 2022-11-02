from tartarus.db import get_db
from tartarus.models.TartarusException import TartarusException

class Balance:
    __id = 0
    __user_id = 0
    __current_balance = 0

    def __init__(self, user_id, balance=0, id=0):
        self.__id = id
        self.__user_id = user_id
        self.__current_balance = balance

    @classmethod
    def fromID(cls, id):
        """Returns the balance corresponding to id, `id`"""
        db = get_db()
        balance = db.execute('SELECT * FROM Balances where BalanceId= ?', (int(id),)).fetchone()
        if balance:
            return cls(
                balance['UserId'],
                balance['CurrentBalance'],
                balance['BalanceId']
            )
        else:
            return None
    
    @classmethod
    def fromUserID(cls, userId):
        """
        Returns the balance corresponding to userID, `userId`
        If no balance exists, creates one.
        """
        db = get_db()
        balance = db.execute('SELECT * FROM Balances where UserId= ?', (int(userId),)).fetchone()
        if balance:
            return cls(
                balance['UserId'],
                balance['CurrentBalance'],
                balance['BalanceId']
            )
        else:
            balance = cls(userId)
            balance.addToDatabase()
            return balance


    @classmethod
    def getStoreBalance(cls):
        """
        Returns the store balance
        """
        return cls.fromUserID(-1)

    def addToDatabase(self):
        db = get_db()
        cur = db.cursor()
        cur.execute(f"INSERT into Balances(UserId, CurrentBalance) VALUES ('{self.getUserID()}', '{self.getBalance()}')")
        db.commit()
        self.__id = db.execute('SELECT * FROM Balances where UserId = ?',(self.getUserID(),)).fetchone()['BalanceId']

    def getId(self):
        return self.__id
    def getUserID(self):
        return self.__user_id
    def getBalance(self):
        return self.__current_balance

    def getJSON(self):
        return {
            "BalanceId": self.getId(),
            "UserId": self.getUserID(),
            "Balance": self.getBalance()
        }

    def increment_balance(self, amt: float):
        self.__current_balance += amt
        db = get_db()
        cur = db.cursor()
        cur.execute(f"UPDATE Balances SET CurrentBalance = {self.getBalance()} WHERE BalanceId = {self.getId()}")
        cur.close()
        db.commit()

    def decrement_balance(self, amt: float):
        if amt > 0:
            amt = -amt
        if self.getBalance + amt < 0:
            raise TartarusException("Balance cannot go below 0")
        self.__current_balance += amt
        db = get_db()
        cur = db.cursor()
        cur.execute(f"UPDATE Balances SET CurrentBalance = {self.getBalance()} WHERE BalanceId = {self.getId()}")
        cur.close()
        db.commit
