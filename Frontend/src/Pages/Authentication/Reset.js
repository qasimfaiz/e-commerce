import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
// import Link from '@mui/material/Link';
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { message } from "antd";
import { USER_RESET, USER_RESET_START } from "../../Redux/actions/Action";
import { publicRequest } from "../../RequestApiCalls/Request";
const theme = createTheme();

export default function Reset() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  function HandleInput(e) {
    setEmail(e.target.value);
    console.log(email);
  }

  // ResetApiCalls Api calls
  const ResetApiCalls = async () => {
    dispatch(USER_RESET_START());

    await publicRequest
      .post("/auth/reset-password", { email })
      .then((res) => {
        dispatch(USER_RESET());
        console.log(res);
        message.success(res.data.message);
        navigate("/Login");
      })
      .catch((error) => {
        // message.error(error);
        message.error(error.response.data.message);
        console.log(error);
        dispatch(USER_RESET());
      })
      .finally(() => {
        dispatch(USER_RESET());
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    ResetApiCalls();
  };

  let IsProcessing = useSelector((state) => state.UserReducer.isFetching);

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h4" sx={{ mb: 8, mt: 3 }}>
            Forgot your password?
          </Typography>
          <Box component="h1" variant="h5">
            <Typography
              component="p"
              variant="body1"
              sx={{ mb: 2, textAlign: "center" }}
            >
              Please provide your registered email address to retrieve your
              password. Thank you.
            </Typography>
          </Box>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              onChange={HandleInput}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {!IsProcessing ? "Send Password" : "Loading..."}
            </Button>
            <Grid container>
              <Grid item xs>
                <Link to="/Login" variant="body2">
                  Back to sign in
                </Link>
              </Grid>
              {/* <Grid item>
                <Link to="/Register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid> */}
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
