import {
  REGISTER_SUCCESS,
  LOGIN_SUCCESS,
  AUTH_ERROR,
  USER_LOADED,
  LOGOUT,
  ACCOUNT_DELETE,
} from '../actions/types';

const initState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null,
};

function authReducer(state = initState, action) {
  const { type, payload } = action;

  switch (type) {
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem('token', payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
      };

    case AUTH_ERROR:
    case LOGOUT:
    case ACCOUNT_DELETE:
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
      };

    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload,
      };

    default:
      return state;
  }
}

export default authReducer;
