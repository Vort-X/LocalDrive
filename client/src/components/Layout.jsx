import { AppBar, Toolbar, Typography, Link, Button, Box } from "@mui/material"
import { Link as RouterLink, Outlet } from "react-router-dom"
import { useAuth } from "../hook/useAuth"

const Layout = () => {
    const {user, signout} = useAuth();

    return (
        <>
            <AppBar position="static" sx={{ backgroundColor: "#00BBBB"}}>
                <Toolbar>
                    <Typography component="h1" variant="h5" sx={{ flexGrow: 0.05, ml: 1 }}>
                        Local Drive
                    </Typography>
                    <Box sx={{ flexGrow: 1, ml: 1 }}>
                        <nav hidden={user.role !== 'Owner'}>
                            <Link 
                                variant="h6" 
                                component={RouterLink} 
                                to='/file'
                                sx={{ my: 1, mx: 2, color: "#FFFFFF", textDecorationColor: "#FFFFFF" }}
                                >
                                Файли
                            </Link>
                            <Link 
                                variant="h6" 
                                component={RouterLink} 
                                to='/profile'
                                sx={{ my: 1, mx: 2, color: "#FFFFFF", textDecorationColor: "#FFFFFF" }}
                                >
                                Профілі
                            </Link>
                        </nav>
                    </Box>
                    <Button variant="text" sx={{ my: 1, mx: 1.5, color: "#FFFFFF", border: "1px solid white" }} onClick={signout}>
                        <Typography variant="h7">
                            Вийти
                        </Typography>
                    </Button>
                </Toolbar>
            </AppBar>
            <Outlet/>
        </>
    )
}

export {Layout}