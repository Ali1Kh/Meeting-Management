import React, { useEffect } from "react";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import axios from "axios";
import { useQuery } from "react-query";
import { TailSpin } from "react-loader-spinner";

export default function History() {

  const token = localStorage.getItem("token")

  const { data, isLoading } = useQuery("getDashBoardSecertar", getDashBoardSecertar);


  function getDashBoardSecertar() {
    return axios.get("https://meetingss.onrender.com/dashboard/getLoginHistory", {
      headers: {
        token: token
      }

    })
  }
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return <>
    <div className="main">
      <div className="container mt-5">
        <h1 className="container d-flex flex-column align-items-center justify-content-center p-4">
          Meetings
        </h1>
        <div className="row gy-3 p-5 pt-0">
          {isLoading ?
            (
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "65vh" }}
              >
                <TailSpin
                  visible={true}
                  height="90"
                  width="90"
                  color="var(--sec-color)"
                  ariaLabel="tail-spin-loading"
                  radius="1"
                  wrapperStyle={{}}
                  wrapperClass=""
                />
              </div>
            ) : (
              <div className="row gy-3">
                <div>
                  <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer sx={{ maxHeight: 440 }}>
                      <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                          <TableRow>
                            <TableCell align="center">Role</TableCell>
                            <TableCell align="center">UserName</TableCell>
                            <TableCell align="center">name</TableCell>
                            <TableCell align="center">Email</TableCell>
                            <TableCell align="center">createdAt</TableCell>
                            <TableCell align="center">agent</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {/* {data
                            ? data?.data.history?.map((histor, idx) => (
                              <TableRow hover tabIndex={-1} key={idx}>
                                <TableCell align="center" component="th" scope="row">{histor.role}</TableCell>
                                <TableCell align="center" component="th">{histor["Secretary"].UserName}</TableCell>
                                <TableCell align="center" component="th">{histor["Secretary"].first_name + " " + histor["Secretary"].last_name}</TableCell>
                                <TableCell align="center" component="th">{histor["Secretary"].E_mail}</TableCell>
                                <TableCell align="center" component="th">{histor.createdAt}</TableCell>
                                <TableCell align="center" component="th">{histor.agent}</TableCell>
                              </TableRow>
                            )) : ""} */}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      component="div"
                      count={data?.data.meetings?.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </Paper>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  </>
}
