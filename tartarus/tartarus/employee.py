from hashlib import new
from .models.Employee import Employee, createEmployee, getEmployee, getAllHoursWorked, getEmployeeHoursWorked, setHoursWorked, setEmployeePayRate, createEmployeeJSON
from .auth import check_token
from flask import Blueprint, request
import datetime

bp = Blueprint('employee', __name__, url_prefix='/employee')

def newEmployee(userId, payRate=15.0):
    oldEmp = getEmployee(userId)
    if payRate < 15.0:
        payRate = 15.0
    if oldEmp is None:
        emp = Employee(userId, payRate, datetime.now())
        createEmployee(emp)
    else:
        if oldEmp.getPayRate() != payRate:
            setEmployeePayRate(userId, payRate)
        
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
        for element in payrollData:
            userId = element[0]
            hoursWorked = element[1]
            payRate = element[2]
            payDue = hoursWorked * payRate
            #insert balance shtuff here
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
        setHoursWorked(hours)
    return (
        {
            "error": error
        },
        status
    )
