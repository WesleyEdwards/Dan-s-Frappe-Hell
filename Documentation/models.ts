
export interface User {
    _id: string;
    name: string;
    email: string;
    password: string;
    customer: Customer;
    employee: Employee | null | undefined;
}

export interface Employee {
    permissions: Permissions;
    workHistory: WorkShift[];
    hourlyWage: number;
}

export enum Permissions {
    ADMIN = "ADMIN",
    WORKER = "WORKER",
}

export interface WorkShift {
    hoursWorked: number;
    date: string;
    paymentStatus: PaymentStatus;
}

export enum PaymentStatus {
    PAID = "PAID",
    UNPAID = "UNPAID"
}

export interface Customer {
    orderHistory: Order[];
    accountBalance: number;
}

export interface Order {
    cart: SelectedFoodItem[];
    status: PaymentStatus;
}

export interface SelectedFoodItem {
    foodItemId: string;
    quantity: number;
    foodModificationIds: string[];
    foodModQuantity: number;
}


export interface FoodItem {
    _id: string;
    name: string;
    price: number;
    description: string;
    possibleModifications: string[];
}

export interface FoodModifications {
    _id: string;
    description: string;
    name: string;
    price: number;
}

export interface Store {
    storeBalance: number;
    currentFoodItems: string[];
    currentFoodMods: string[];
    currentEmployees: string[];
    foodItemStock: FoodItemStock[];
    foodModStock: FoodModStock[];
}

export interface FoodItemStock {
    foodItemId: string;
    quantity: number;
}
export interface FoodModStock {
    foodItemId: string;
    quantity: number;
}