import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { RegisterApiCalls } from "../../RequestApiCalls/UserApiCalls";
import { useDispatch, useSelector } from "react-redux";
import { message } from "antd";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const theme = createTheme();

export default function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [Input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });

  // Show Password
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  function HandleInput(e) {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setPassword(Input.password);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!Input.username || !Input.email || !Input.password) {
    //   return message.error("Please fill all the fields");
    // }
    RegisterApiCalls(dispatch, navigate, message, Input);
  };

  let IsProcessing = useSelector((state) => state.UserReducer.isFetching);

  // console.log(Input)
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
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  onChange={HandleInput}
                  autoComplete="given-name"
                  name="username"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  autoFocus
                />
              </Grid>
              {/* <Grid item xs={12} sm={6}>
                <TextField onChange={HandleInput}
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="sname"
                  autoComplete="family-name"
                />
              </Grid> */}
              <Grid item xs={12}>
                <TextField
                  onChange={HandleInput}
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  onChange={HandleInput}
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox value="allowExtraEmails" color="primary" />
                  }
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {!IsProcessing ? "Sign Up" : "Loading..."}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/Login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
