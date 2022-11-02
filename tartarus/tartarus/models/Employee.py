from tartarus.db import get_db

class Employee:
    __id = 0
    __userId = 0
    __PayRate = 0
    __HireDate = None
    __HoursWorked = 0
    def __init__(self, userId, payRate, hireDate) -> None:
        self.__userId = userId
        self.__PayRate = payRate
        self.__HireDate = hireDate

    def getId(self):
        return self.__id
    def getUserId(self):
        return self.__userId
    def getPayRate(self):
        return self.__PayRate
    def getHireDate(self):
        return self.__HireDate
    def getHoursWorked(self):
        return self.__HoursWorked
    
    def setId(self, id):
        self.__id = id
    def setUserId(self, userId):
        self.__userId = userId
    def setPayRate(self, payRate):
        self.__PayRate = payRate
    def setHireDate(self, hireDate):
        self.__HireDate = hireDate
    def setHoursWorked(self, hours):
        self.__HoursWorked = hours

def getEmployee(userId):
    db = get_db()
    cur = db.cursor()
    output = cur.execute(f'select * from Employees where UserId = {userId}')
    data = output.fetchone()
    if (data is not None):
        employee = Employee(data[1], data[2], data[3])
        employee.setHoursWorked = (data[4])
        employee.setId(data[0])
        return employee
    else:
        return None

def getAllHoursWorked():
    db = get_db()
    cur = db.cursor()
    output = cur.execute('select userId, HoursWorked, PayRate from Employees')
    return output.fetchall()

def getEmployeeHoursWorked(userId):
    db = get_db()
    cur = db.cursor()
    output = cur.execute(f'select HoursWorked from Employees where userId = {userId}')
    data = output.fetchone()
    return data[0]

def setHoursWorked(userId, hoursWorked):
    db = get_db()
    cur = db.cursor()
    total = getEmployeeHoursWorked(userId) + hoursWorked
    cur.execute(f'update Employees set HoursWorked = {total} where userId = {userId}')
    db.commit()

def setEmployeePayRate(userId, newRate):
    db = get_db()
    cur = db.cursor()
    cur.execute(f'update Employees set PayRate = {newRate} where userId = {userId}')
    db.commit()

def createEmployee(employee: Employee):
    db = get_db()
    cur = db.cursor()
    cur.execute(f"insert into Employees (UserId, PayRate, HireDate, HoursWorked) values ({employee.getUserId()}, {employee.getPayRate()}, '{employee.getHireDate()}', 0)")
    db.commit()

def createEmployeeJSON(emp: Employee):
    id = emp.getId()
    userId = emp.getUserId()
    payRate = emp.getPayRate()
    hireDate = emp.getHireDate()
    hoursWorked = emp.getHoursWorked()

    return {
        'employeeId': id,
        'userId': userId,
        'payRate': payRate,
        'hireDate': hireDate,
        'hoursWorked': hoursWorked
    }