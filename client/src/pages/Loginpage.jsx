import { useNavigate } from "react-router-dom";
import { useAuth } from "../hook/useAuth";

import { Box, Typography, TextField, Button, Container } from "@mui/material";

import { sendLoginRequest } from "../scripts/requestProvider";

const Login = () => {
    const navigate = useNavigate();
    const {signin} = useAuth();

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.target;
        const login = form.login.value;
        const password = form.password.value;

        const data = {
            "login": login,
            "password": password,
        }

        sendLoginRequest(data, (user) => {
            const toPage = user.role === 'Owner' ? '/file' : '/home';
            signin(user, () => navigate(toPage, {replace: true}));
        }, (error) => {
            alert("Bad credentials");
        });
    }

    return (
        <Container component="main" maxWidth="xs">
            <Box 
                sx={{
                    marginTop: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h4">
                    Sign In
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt:1 }}>
                    <TextField margin="normal" required fullWidth name="login" label="Login" />
                    <TextField margin="normal" required fullWidth name="password" label="Password" autoComplete="off" type="password" />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2, backgroundColor: '#00BBBB' }}
                    >
                        Sign In
                    </Button>
                </Box>
            </Box>
        </Container>
    )
}

export {Login};