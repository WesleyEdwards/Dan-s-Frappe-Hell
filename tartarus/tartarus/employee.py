from hashlib import new
from .models.Employee import Employee, createEmployee, getEmployee, getAllHoursWorked, getEmployeeHoursWorked, setHoursWorked, setEmployeePayRate, createEmployeeJSON, resetHours, allEmployeeInfo
from .auth import check_token
from flask import Blueprint, request
from datetime import datetime
from .models.Balance import Balance 
bp = Blueprint('employee', __name__, url_prefix='/employee')

def newEmployee(userId, payRate=15.0):
    if payRate < 15.0:
        payRate = 15.0
    emp = Employee(userId, payRate, datetime.now())
    createEmployee(emp)

        
@bp.route('/data', methods=(['GET']))
def getEmp():
    status = 200
    error = None
    employee = None
    auth = check_token(request.headers['Authorization'])
    if (auth[0] is None):
        error = "Invalid token"
        status = 401
    else:
        user = auth[0]
        emp = getEmployee(user.getId())
        if emp is None:
            error = "No Employee found"
            status = 404
        else:
            employee = createEmployeeJSON(emp)
    return (
        {
            "error": error,
            "employee": employee
        },
        status
    )

@bp.route('/payroll', methods=(['GET']))
def payroll():
    status = 200
    error = None
    auth = check_token(request.headers['Authorization'], 3)
    if(not auth[1]):
        status = 401
        error = "Invalid or expired token"
    else:
        payrollData = getAllHoursWorked()
        storeBalance = Balance.getStoreBalance()
        for element in payrollData:
            userId = element[0]
            hoursWorked = element[1]
            payRate = element[2]
            payDue = hoursWorked * payRate
            userBalance = Balance.fromUserID(userId)
            try:
                storeBalance.decrement_balance(payDue)
                userBalance.increment_balance(payDue)
            except Exception as ex:
                status = 409
                error = str(ex)
        resetHours()       
    return(
        {
            "error": error
        },
        status
    )

@bp.route('/setPay', methods=(['POST']))
def setPayRate():
    status = 200
    error = None
    employee = None
    auth = check_token(request.headers['Authorization'], 3)
    if not auth[1]:
        status = 403
        error = "Invalid Permissions"
    if auth[0] == None:
        status = 401
        error = "Ivalid Token"
    else:
        result = request.get_json()
        userId = result['userId']
        newRate = result['payRate']
        if newRate < 15.0:
            newRate = 15.0
        setEmployeePayRate(userId, newRate)
    return(
        {
            "error": error
        },
        status
    )

@bp.route('/logHours', methods=(['POST']))
def logHours():
    status = 200
    error = None
    auth = check_token(request.headers['Authorization'], 1)
    if auth[0] is None:
        error = "Invalid Token"
        status = 401
    elif not auth[1]:
        error = "Invalid permissions"
        status = 403
    else:
        hours = request.get_json()['hours']
        setHoursWorked(auth[0].getId(), hours)
    return (
        {
            "error": error
        },
        status
    )

@bp.route('/all', methods=(['GET']))
def allEmployees():
    status = 200
    error = None
    employees = []
    auth = check_token(request.headers['Authorization'], 2)
    if auth[0] is None:
        error = "Invalid Token"
        status = 401
    elif not auth[1]:
        error = "Invalid permissions"
        status = 403
    else:
        for element in allEmployeeInfo():
            employees.append({
                'userId': element[0],
                'firstName': element[1],
                'lastName': element[2],
                'payRate': element[3],
                'hireDate': element[4],
                'hoursWorked': element[5]
            })
    return(
        {
            'employees': employees,
            'error': error
        },
        status
    )