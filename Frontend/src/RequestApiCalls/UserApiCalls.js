import { publicRequest } from "./Request";
import {
  FETCHING,
  LOGIN__FAIL,
  LOGIN__SUCCESS,
  UPDATED_USER,
  USER_UPDATE_ERROR,
  USER__REGISTERED,
} from "../Redux/actions/Action";

// Login Api calls
export const LoginApiCalls = async (
  dispatch,
  navigate,
  message,
  { email, password }
) => {
  dispatch(FETCHING());
  try {
    const res = await publicRequest.post("/auth/login", { email, password });
    console.log(res);
    message.success(res.data.message);
    dispatch(LOGIN__SUCCESS(res.data));
    navigate("/");
  } catch (error) {
    // Server responded with an error status code
    console.log(error.response.data.message);
    dispatch(LOGIN__FAIL());
    message.error(error.response.data.message);
  }
};

//Registration Api Call
export const RegisterApiCalls = async (
  dispatch,
  navigate,
  message,
  { username, email, password }
) => {
  dispatch(FETCHING());
  try {
    const res = await publicRequest.post("/auth/register", {
      username,
      email,
      password,
    });
    console.log(res);
    message.success(res.data.message);
    dispatch(USER__REGISTERED());
    navigate("/Login");
  } catch (error) {
    message.error(error.response.data.message);
    console.log(error);
    dispatch(LOGIN__FAIL());
  }
};

//Logout Api Call
export const LogoutApiCalls = async (navigate, message) => {
  try {
    const res = await publicRequest.get("/auth/logout");
    message.success(res.data.message);
    navigate("/Login");
  } catch (error) {
    message.error(error.response.data.message);
  }
};

// Update Profile Api Call

export const UpdateProfileApiCalls = async (
  formData,
  id,
  dispatch,
  navigate,
  message
) => {
  // dispatch(FETCHING());
  try {
    const res = await publicRequest.patch(
      `/users/user/update-profile/${id}`,
      formData
    );
    console.log(res);
    message.success(res.data.message);
    dispatch(UPDATED_USER(res.data.updatedUser));
    navigate(`/Profile/${id}`);
  } catch (error) {
    message.error(error.response.data.message);
    console.log(error.response.data);
  }
};

// Update Profile Api Call

export const UpdateProfilePic = async (data, id) => {
  // dispatch(FETCHING());
  try {
    const response = await publicRequest.post(
      `/users/user/upload-profile-pic/${id}`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    // message.error(error.response.data.message);
    console.log(error.response);
  }
};

// Change Password Api Call

export const UpdatePasswordApiCalls = async (
  password,
  newPassword,
  id,
  navigate,
  message
) => {
  try {
    const res = await publicRequest.patch(`/users/change-password/${id}`, {
      password,
      newPassword,
    });
    console.log(res);
    message.success(res.data.message);

    navigate(`/Profile/${id}`);
  } catch (error) {
    message.error(error.response.data.message);
  }
};
