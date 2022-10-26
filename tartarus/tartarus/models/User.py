import sqlite3
from webbrowser import get
from tartarus.db import get_db

from colorama import Cursor

class User:
    __id = 0
    __firstName = ""
    __lastName = ""
    __email = ""
    __password = ""
    __permissions = 0
    def __init__(self, firstName, lastName, email, password, permissions = 0):
        self.__firstName = firstName
        self.__lastName = lastName
        self.__email = email
        self.__password = password
        self.__permissions = permissions
    
    def getId(self):
        return self.__id
    def getFullName(self):
        return self.__firstName + " " + self.__lastName
    def getFirstName(self):
        return self.__firstName
    def getLastName(self):
        return self.__lastName
    def getEmail(self):
        return self.__email
    def getPermissions(self):
        return self.__permissions
    def setPermissions(self, permission):
        self.__permissions = permission
    def getPassword(self):
        return self.__password
    def setId(self, id):
        self.__id = id

def getUserByEmail(email):
    db = get_db()
    cur = db.cursor()
    output = cur.execute(f"select * from users where email = '{email}'" )
    data = output.fetchone()
    if (data is not None):
        user = User(data[2], data[3], data[1], data[4], data[5])
        user.setId(data[0])
        return user
    else:
        return None
def getUserById(id):
    db = get_db()
    cur = db.cursor()
    output = cur.execute(f"select * from users where UserId = '{id}'" )
    data = output.fetchone()
    if (data is not None):
        user = User(data[2], data[3], data[1], data[4], int(data[5]))
        user.setId(id)
        return user
    else:
        return None

def getUserList():
    db = get_db()
    cur = db.cursor()
    output = cur.execute("select * from users")
    return output.fetchall()

def checkExistingUser(email):
    if (getUserByEmail(email) is None):
        return False
    else:
        return True

def addUser(user:User):
    db = get_db()
    cur = db.cursor()
    cur.execute(f"Insert into users (email, FirstName, LastName, password, PermissionLevel) values ('{user.getEmail()}', '{user.getFirstName()}', '{user.getLastName()}', '{user.getPassword()}', '{user.getPermissions()}')")
    db.commit()

def updatePermissions(id, permission):
    db = get_db()
    cur = db.cursor()
    cur.execute(f"update users set permissionlevel = {permission} where UserId = {id}")
    db.commit()

def updateEmail(id, email):
    db = get_db()
    cur = db.cursor()
    if(checkExistingUser(email)):
        return False
    else:
        cur.execute(f"update users set email = '{email}' where userId = {id}")
        db.commit()
        return True

def updateName(id, firstName, lastName):
    db = get_db()
    cur = db.cursor()
    cur.execute(f"update users set FirstName = '{firstName}', LastName = '{lastName}' where userId = {id}")
    db.commit()

def updatePassword (id, password):
    db = get_db()
    cur = db.cursor()
    cur.execute(f"update users set password = '{password}' where userId = {id}")
    db.commit()


def createUserJSON(user:User):
    id = user.getId()
    fname = user.getFirstName()
    lname = user.getLastName()
    email = user.getEmail()
    perm = user.getPermissions()
    
    return {
                'userId':id,
                'firstName':fname,
                'lastName':lname,
                'email':email,
                'permissions':perm
            }