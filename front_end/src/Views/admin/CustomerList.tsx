import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { FC, useEffect, useState } from "react";
import { getAllUsers } from "../../api/api-functions";
import { Loading } from "../../components/Loading";
import { getUserPermissionString } from "../../utils/helperFunctions";

interface CustomerListProps {
  refreshTrigger: boolean;
  setSelectedUser: (user: UserRow | undefined) => void;
  permissionLevels: string[];
}

export interface UserRow {
  id: string;
  name: string;
  email: string;
  status: string;
}

export const IngredientsEdit: FC<CustomerListProps> = (props) => {
  const [currentUsers, setCurrentUsers] = useState<UserRow[] | undefined>();
  const { refreshTrigger, setSelectedUser, permissionLevels } = props;

  const refreshUsers = () => {
    setCurrentUsers(undefined);
    const newList: UserRow[] = [];
    getAllUsers()
      .then((res) => {
        res.map((user) => {
          const perms = user.permissions.toString();
          if (permissionLevels.includes(perms)) {
            return newList.push({
              id: user.userId,
              name: `${user.firstName} ${user.lastName}`,
              email: user.email,
              status: getUserPermissionString(perms),
            });
          }
          return newList;
        });
      })
      .then(() => setCurrentUsers(newList));
  };

  useEffect(() => {
    refreshUsers();
  }, [refreshTrigger]);

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      width: 150,
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      width: 150,
    },
    {
      field: "status",
      headerName: "Status",
      sortable: true,
      width: 150,
    },
  ];

  return (
    <>
      {currentUsers !== undefined ? (
        <DataGrid
          rows={currentUsers}
          autoHeight={true}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[15]}
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: false }}
          onCellClick={(params) => setSelectedUser(params.row)}
        />
      ) : (
        <Loading />
      )}
    </>
  );
};

export default IngredientsEdit;
