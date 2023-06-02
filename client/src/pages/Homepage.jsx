import { useState, useEffect } from "react";
import { Container, List, ListItem, IconButton, ListItemText, Divider, SvgIcon, ListItemIcon } from "@mui/material";
import { BoldText } from "../components/BoldText";
import { sendDownloadFileRequest, sendGetFilesRequest } from "../scripts/requestProvider";
import { sizeToString } from "../scripts/sizeToString";
import { ReactComponent as DownloadIcon } from "../static/download.svg"
import { ReactComponent as FileIcon } from "../static/file.svg"

const Home = () => {
    const [fileList, setFileList] = useState([]);

    const downloadFile = (file) => sendDownloadFileRequest({
        id: file.id,
    }, (blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', file.filename);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
    }, (err) => {
        console.log(err);
    });

    useEffect(() => {
        sendGetFilesRequest({}, (data) => {
            console.log(data);
            setFileList(data);
        }, () => {});
    }, []);

    return (
        <Container component="main">
            <List sx={{ width: '100%' }}>
                {fileList && (
                    <>
                        <ListItem secondaryAction={<IconButton disabled/>}>
                            <ListItemIcon />
                            <ListItemText primary={<BoldText>Ім'я</BoldText>} sx={{ width: '60%' }} />
                            <ListItemText primary={<BoldText>Дата завантаження</BoldText>} sx={{ width: '30%' }} />
                            <ListItemText primary={<BoldText>Розмір</BoldText>} sx={{ width: '10%' }} />
                        </ListItem>
                        <Divider />
                        {
                            fileList.map((file) => (
                                <>
                                    <ListItem
                                        secondaryAction={
                                            <IconButton edge="end" aria-label="download" onClick={() => downloadFile(file)}>
                                                <SvgIcon component={DownloadIcon} sx={{ color: '#000000' }} inheritViewBox />
                                            </IconButton>
                                        }
                                    >
                                        <ListItemIcon>
                                            <SvgIcon component={FileIcon} sx={{ color: '#000000' }} inheritViewBox  />
                                        </ListItemIcon>
                                        <ListItemText primary={file.filename} sx={{ width: '60%' }} />
                                        <ListItemText primary={(new Date(file.uploadDate)).toLocaleString()} sx={{ width: '30%' }} />
                                        <ListItemText primary={sizeToString(file.size)} sx={{ width: '10%' }} />
                                    </ListItem>
                                    <Divider />
                                </>
                            ))
                        }
                    </>
                )
                    
                }
            </List>
            
        </Container>
    )
}

export {Home};