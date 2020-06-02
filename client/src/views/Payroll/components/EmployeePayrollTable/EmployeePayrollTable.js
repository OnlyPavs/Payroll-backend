import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MaterialTable, { MTableToolbar } from 'material-table';
import { Button, Select, MenuItem } from '@material-ui/core';
import PropTypes from 'prop-types';
import moment from 'moment';

import { updatePayrollEmployee } from '../../../../services/payrollEmployeeServices';

const EmployeePayrollTable = (props) => {
  const { payroll, duties, positions, employee, onHandleToggle } = props;
  const dispatch = useDispatch();
  const { payrollEmployees, empId, payId } = useSelector((state) => state.payrollEmployees);
  let [employeePayrolls, setEmployeePayroll] = useState(payrollEmployees);
  const employeePosition = employee.find((o) => o.empId === empId);
  const employeePayroll = payroll.find((o) => o.payId === payId);
  let payrollTitle = '';
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    setEmployeePayroll(payrollEmployees);
  }, [payrollEmployees]);

  const state = {
    columns: [
      { title: 'Id', field: '_id', hidden: true },
      { title: 'Day', field: 'day', width: 30, editable: 'never' },
      {
        title: 'Duty',
        field: 'duty',
        width: 60,
        editComponent: (props) => (
          <Select
            value={props.value}
            onChange={(e) => {
              var data = { ...props.rowData };
              data.duty = e.target.value;
              data.amount = getRateFromDuty(e.target.value) * getRateFromPosition();
              props.onRowDataChange(data);
            }}
          >
            {duties.map((e, key) => (
              <MenuItem value={e.duty} key={key}>
                {e.duty}
              </MenuItem>
            ))}
          </Select>
        ),
      },
      { title: 'Amount', field: 'amount', width: 60, type: 'numeric', editable: 'never' },
      {
        title: 'Last updated',
        field: 'updatedAt',
        width: 40,
        editable: 'never',
        render: (rowData) => rowData && rowData.updatedAt && <p>{new Date(rowData.updatedAt).toDateString()}</p>,
        customSort: (a, b) => {
          var a1 = new Date(a.updatedAt).getTime();
          var b1 = new Date(b.updatedAt).getTime();
          if (a1 < b1) return 1;
          else if (a1 > b1) return -1;
          else return 0;
        },
      },
    ],
  };

  const handleOpen = () => {
    onHandleToggle();
  };

  const getRateFromDuty = (duty) => {
    let obj = duties.find((o) => o.duty === duty);
    return obj.rate;
  };

  const getRateFromPosition = () => {
    let obj = positions.find((o) => o.position === employeePosition.position);
    return obj.rate;
  };

  const convertStringToDateFormat = (date) => {
    return moment(new Date(date.substring(date.length - 4) + '-' + date.substring(0, 1) + '-1')).format('MMMM yyyy');
  };

  if (employeePosition !== undefined && employeePayroll !== undefined) {
    payrollTitle =
      convertStringToDateFormat(employeePayroll.month) +
      ` - ${employeePosition.firstName} ${employeePosition.lastName} (${employeePosition.empId})`;
  }

  return (
    <MaterialTable
      title={payrollTitle}
      columns={state.columns}
      data={employeePayrolls}
      onRowClick={(evt, selectedRow) => setSelectedRow(selectedRow.tableData.id)}
      options={{
        headerStyle: { backgroundColor: '#5c6bc0', color: 'white' },
        pageSize: 20,
        rowStyle: (rowData) => ({
          backgroundColor: selectedRow === rowData.tableData.id ? '#EEE' : '#FFF',
          height: '1px',
        }),
      }}
      components={{
        Toolbar: (props) => (
          <div>
            <MTableToolbar {...props} />
            <div style={{ padding: '10px 10px' }}>
              <Button color="primary" variant="outlined" onClick={handleOpen}>
                Back
              </Button>
            </div>
          </div>
        ),
      }}
      editable={{
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve, reject) => {
            dispatch(updatePayrollEmployee(newData))
              .then((updatedDuty) => {
                const data = [...employeePayrolls];
                data[data.indexOf(oldData)] = updatedDuty;
                setEmployeePayroll(data);
              })
              .catch(() => reject())
              .then(() => resolve());
          }),
      }}
    />
  );
};

EmployeePayrollTable.propTypes = {
  employeePayrolls: PropTypes.array,
};

export default EmployeePayrollTable;
