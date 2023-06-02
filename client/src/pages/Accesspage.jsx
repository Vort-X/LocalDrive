import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"
import { Checkbox, Container, List, ListItem, ListItemText, Divider, Typography } from "@mui/material";
import { sendGetAccessesRequest, sendGrantAccessRequest, sendRevokeAccessRequest } from "../scripts/requestProvider";
import { BoldText } from "../components/BoldText";

const Access = () => {
    const {id} = useParams();
    const [login, setLogin] = useState(null);
    const [accessList, setAccessList] = useState([]);

    const date = (access) => {
        return access.hasAccess && (new Date(access.lastDownload || '0001-01-01T00:00:00')).toLocaleString() 
    }

    const onAccessChange = (access) => {
        access.hasAccess = !access.hasAccess;
        access.hasAccess ? sendGrantAccessRequest({
            profileId: id,
            fileId: access.id,
        }, () => {}, (error) => {
            alert("Unexpected error");
            console.log(error);
        }) : sendRevokeAccessRequest({
            profileId: id,
            fileId: access.id,
        }, () => {}, (error) => {
            alert("Unexpected error");
            console.log(error);
        })
        setAccessList(accessList.map((a) => a));
    }

    useEffect(() => {
        sendGetAccessesRequest({id}, (data) => {
            setLogin(data.user);
            setAccessList(data.files);
        }, () => {})
    }, [id]);

    return (
        <Container component="main">
            <Typography component="h1" variant="h4" sx={{ mt: 3, mb: 2}}>
                Редагувати доступ для користувача {login}
            </Typography>
            <List sx={{ width: "100%"}}>
                { accessList && (
                    <>
                        <ListItem>
                            <ListItemText primary={<BoldText>Назва файлу</BoldText>} sx={{ width: "70%"}} />
                            <ListItemText primary={<BoldText>Останнє завантаження</BoldText>} sx={{ width: "30%"}} />
                            <ListItemText primary={<BoldText>Доступ</BoldText>} />
                        </ListItem>
                        <Divider/>
                        { 
                            accessList.map((access) => (
                                <>
                                    <ListItem>
                                        <ListItemText primary={access.filename} sx={{ width: "70%"}} />
                                        <ListItemText primary={date(access)} sx={{ width: "30%"}} />
                                        <Checkbox checked={access.hasAccess} onChange={() => {onAccessChange(access)}} sx={{ right: "0px"}} />
                                    </ListItem>
                                    <Divider/>
                                </>
                            ))
                        }
                    </>
                )}
            </List>
        </Container>
    )
}

export {Access}