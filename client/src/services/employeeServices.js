import axios from 'axios';
import { GET_EMPLOYEES } from './types';
import { setSnackbarMessageSuccess, setSnackbarMessageError } from './snackbarServices';

// Get all employee
export const getEmployees = () => (dispatch) => {
  axios
    .post('/employees/getAll')
    .then((res) => {
      dispatch(setEmployees(res.data));
    })
    .catch((err) => {
      console.log('err', err);
    });
};

// Add new employee
export const addEmployee = (employee) => async (dispatch) => {
  return await axios
    .post('/employees/add', employee)
    .then((res) => {
      // Toggle on notification
      dispatch(setSnackbarMessageSuccess(res.data.msg));
      return Promise.resolve(res.data.employees);
    })
    .catch((err) => {
      // Toggle on notification
      dispatch(setSnackbarMessageError(err.response.data));
      return Promise.reject();
    });
};

// Set employee
export const setEmployees = (payload) => {
  return {
    type: GET_EMPLOYEES,
    payload: payload,
  };
};