class User:
    __id = 0
    __name = ""
    __email = ""
    __password = ""
    __permissions = 0
    def __init__(self, name, email, password, permissions = 0):
        self.__name = name
        self.__email = email
        self.__password = password
        self.__permissions = permissions
    
    def getId(self):
        return self.__id
    def getName(self):
        return self.__name
    def getEmail(self):
        return self.__email
    def getPermissions(self):
        return self.__permissions
    def getPassword(self):
        return self.__password
    def setId(self, id):
        self.__id = id