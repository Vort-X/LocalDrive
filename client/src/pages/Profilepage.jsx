import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, List, ListItem, ListItemText, Divider, IconButton, SvgIcon, Button, TextField, Menu, MenuItem, ListItemIcon } from "@mui/material";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material"
import { BoldText } from "../components/BoldText";
import { sendGetProfilesRequest, sendCreateProfileRequest, sendUpdateProfileRequest, sendDeleteProfileRequest } from "../scripts/requestProvider";
import { ReactComponent as MoreIcon } from "../static/more_vert.svg";
import { ReactComponent as UserIcon } from "../static/user.svg";
import { ReactComponent as AdminIcon } from "../static/admin.svg";
import { useAuth } from "../hook/useAuth";

const Profile = () => {
    const {user, signout} = useAuth();
    const navigate = useNavigate();
    const [profileList, setProfileList] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState(0);
    const [loginError, setLoginError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const [oldLogin, setOldLogin] = useState("");
    const open = Boolean(anchorEl);

    const getLoginErrorText = (str) => {
        if (!str) return "Поле має бути заповненим";
        if (str.length < 4) return "Довжина має бути не менше 4 символів";

        const special = '`~@#$%^&()[]{}+-*=/\\"\'<>!?,.;:';

        for (let index = 0; index < str.length; index++) {
            const element = str[index];
            if (special.includes(element)) return `Некоректний символ: ${element}`;
        }

        if (!selectedProfile && profileList.find((p) => p.login === str)) return "Профіль з указаним логіном вже існує";

        return "";
    }

    const getPasswordErrorText = (str) => {
        if (!str) return "Поле має бути заповненим";
        if (str.length < 6) return "Довжина має бути не менше 6 символів";

        return "";
    }

    const openMenu = (event, profileId) => {
        setSelectedProfile(profileId)
        setAnchorEl(event.currentTarget);
    }

    const closeMenu = () => {
        setSelectedProfile(0)
        setAnchorEl(null);
    }

    const EditProfile = () => {
        setAnchorEl(null);
        openProfileDialog();
    }

    const DeleteProfile = () => {
        sendDeleteProfileRequest(selectedProfile, () => {
            sendGetProfilesRequest({}, setProfileList, () => {});
        }, (error) => {
            alert("Unexpected error");
            console.log(error);
        });
        closeMenu();
    }

    const openProfileDialog = () => {
        if (selectedProfile) {
            setOldLogin(profileList.find(p => p.id === selectedProfile).login);
        }
        setOpenDialog(true);
    }

    const closeProfileDialog = (isSave) => {
        if (isSave) {
            const newLogin = document.getElementById("new-login").value;
            const newPassword = document.getElementById("new-password").value;
            const lErr = getLoginErrorText(newLogin);
            const pErr = getPasswordErrorText(newPassword);
            setLoginError(lErr);
            setPasswordError(pErr);
            if (lErr || pErr) {
                return;
            } 
            if (selectedProfile) {
                sendUpdateProfileRequest({
                    'id': selectedProfile,
                    'login': newLogin,
                    'password': newPassword,
                }, (_) => {
                    const profile = profileList.find((p) => p.id === selectedProfile);
                    profile.isOwner ? signout() : sendGetProfilesRequest({}, setProfileList, () => {});
                }, (error) => {
                    alert("Unexpected error");
                    console.log(error);
                });
            } else {
                sendCreateProfileRequest({
                    'login': newLogin,
                    'password': newPassword,
                }, (_) => {
                    sendGetProfilesRequest({}, setProfileList, () => {});
                }, (error) => {
                    alert("Unexpected error");
                    console.log(error);
                });
            }
        }
        setOpenDialog(false);
        setLoginError("");
        setPasswordError("");
        setSelectedProfile(0);
    }

    useEffect(() => {
        sendGetProfilesRequest({}, setProfileList, () => {});
    }, [])

    return (
        <Container component="main">
            <Button 
                type="button"
                variant="contained"
                onClick={openProfileDialog}
                sx={{ mt: 3, mb: 2, backgroundColor: '#00BBBB', color: '#FFFFFF', minWidth: '150px' }} 
            >
                Створити
            </Button>
            <List sx={{ width: "100%"}}>
                { profileList && (
                    <>
                        <ListItem secondaryAction={<IconButton disabled/>}>
                            <ListItemIcon/>
                            <ListItemText primary={<BoldText>Логін</BoldText>} sx={{ width: '40%' }} />
                            <ListItemText primary={<BoldText>Останній вхід</BoldText>} sx={{ width: '30%' }} />
                            <ListItemText primary={<BoldText>Дата змінення</BoldText>} sx={{ width: '30%' }} />
                        </ListItem>
                        <Divider />
                        {
                            profileList.map((profile) => (
                                <>
                                    <ListItem 
                                        secondaryAction={
                                            <IconButton
                                                aria-haspopup="true"
                                                aria-expanded={open ? 'true' : undefined}   
                                                onClick={(e) => openMenu(e, profile.id)}
                                            >
                                                <SvgIcon component={MoreIcon} sx={{ color: '#000000' }} inheritViewBox />
                                            </IconButton>
                                        }
                                    >
                                        <ListItemIcon>
                                            <SvgIcon component={profile.login === user.name ? AdminIcon : UserIcon} sx={{ color: '#000000' }} inheritViewBox  />
                                        </ListItemIcon>
                                        <ListItemText primary={profile.login} sx={{ width: '40%' }} />
                                        <ListItemText primary={(new Date(profile.lastSignInDate)).toLocaleString()} sx={{ width: '30%' }} />
                                        <ListItemText primary={(new Date(profile.lastModifyDate)).toLocaleString()} sx={{ width: '30%' }} />
                                    </ListItem>
                                    <Divider />
                                </>
                            ))
                        }
                    </>
                )}
            </List>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={closeMenu}
            >
            <MenuItem onClick={() => {navigate(`/access/${selectedProfile}`)}}>Редагувати доступ</MenuItem>
                <MenuItem onClick={EditProfile}>Редагувати профіль</MenuItem>
                <MenuItem onClick={DeleteProfile}>Видалити</MenuItem>
            </Menu>

            <Dialog open={openDialog} onClose={() => {closeProfileDialog(false)}}>
                <DialogTitle>{selectedProfile ? `Редагування профілю ${oldLogin}` : "Новий профіль"}</DialogTitle>
                <DialogContent>
                    <TextField 
                        margin="normal" 
                        required 
                        fullWidth 
                        id="new-login" 
                        label="Логін" 
                        error={!!loginError} 
                        helperText={loginError} 
                        autoComplete="off"
                    />
                    <TextField 
                        margin="normal" 
                        required 
                        fullWidth 
                        id="new-password" 
                        label="Пароль" 
                        error={!!passwordError} 
                        helperText={passwordError} 
                        autoComplete="off"
                        type="password"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {closeProfileDialog(false)}}>Відмінити</Button>
                    <Button onClick={() => {closeProfileDialog(true)}}>Зберегти</Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}

export {Profile};