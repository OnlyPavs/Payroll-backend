import { SET_CURRENT_USER, USER_LOADING } from '../services/types';

const isEmpty = require('is-empty');

const initialState = {
  isAuthenticated: false,
  user: {},
  loading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload,
      };
    case USER_LOADING:
      return {
        loading: action.payload,
      };
    default:
      return state;
  }
}
