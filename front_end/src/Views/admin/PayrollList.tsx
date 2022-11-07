import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { FC, useEffect, useState } from "react";
import {getAllEmployees} from "../../api/api-functions";
import { Loading } from "../../components/Loading";


export interface EmployeeRow {
    id: string;
    name: string;
    hours: number;
    payRate: number;
}

export const PayrollList: FC = () => {
    const [currentEmployees, setCurrentEmployees] = useState<EmployeeRow[] | undefined>();

    const refreshUsers = () => {
        setCurrentEmployees(undefined);
        const newList: EmployeeRow[] = [];
        getAllEmployees()
            .then((res) => {
                res.map((employee) => {
                        return newList.push({
                            id: employee.hireDate,
                            name: `${employee.firstName} ${employee.lastName}`,
                            hours: employee.hoursWorked,
                            payRate: employee.payRate,
                        });
                });
            })
            .then(() => setCurrentEmployees(newList));
    };

    useEffect(() => {
        refreshUsers();
    }, []);

    const columns: GridColDef[] = [
        {
            field: "name",
            headerName: "Name",
            width: 150,
            flex: 1,
        },
        {
            field: "hours",
            headerName: "Hours Worked",
            width: 150,
        },
        {
            field: "payRate",
            headerName: "Rate of Pay",
            width: 150,
        }
    ];

    return (
        <>
            {currentEmployees !== undefined ? (
                <DataGrid
                    rows={currentEmployees}
                    autoHeight={true}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[15]}
                    disableSelectionOnClick
                    experimentalFeatures={{ newEditingApi: false }}
                />
            ) : (
                <Loading />
            )}
        </>
    );
};

export default PayrollList;
