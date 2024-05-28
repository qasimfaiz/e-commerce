import * as actions from "../actions/actionType";

const InitialState = {
  CurrentUser: null,
  isFetching: false,
  loginFail: false,
};
export const UserReducer = (state = InitialState, action) => {
  switch (action.type) {
    case actions.LOGIN_START:
      return {
        isFetching: true,
        CurrentUser: null,
        loginFail: false,
      };
    case actions.LOGIN_SUCCESS:
      return {
        CurrentUser: action.payload,
        isFetching: false,
        loginFail: false,
      };
    case actions.UPDATED_USER:
      return {
        CurrentUser: action.payload,
        isFetching: false,
        loginFail: false,
      };
    case actions.LOGIN_FALIURE:
      return {
        isFetching: false,
        loginFail: true,
        CurrentUser: null,
      };
    case actions.USER_LOGOUT:
      return {
        CurrentUser: null,
        isFetching: false,
        loginFail: false,
      };
    case actions.USER_REGISTERED:
      return {
        isFetching: false,
        loginFail: false,
        CurrentUser: null,
      };
    case actions.USER_RESET:
      return {
        isFetching: false,
        loginFail: false,
        CurrentUser: null,
      };
    case actions.USER_RESET_START:
      return {
        CurrentUser: null,
        isFetching: true,
        loginFail: false,
      };
    case actions.USER_UPDATE_ERROR:
      return {
        isFetching: false,
        loginFail: false,
      };
    default:
      return state;
  }
};
