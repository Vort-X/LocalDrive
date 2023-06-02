import { useState, useEffect } from "react";
import { Button, Container, Divider, IconButton, Input, List, ListItem, ListItemIcon, ListItemText, SvgIcon } from "@mui/material";
import { sendGetFilesRequest, sendShareFileRequest, sendUnshareFileRequest } from "../scripts/requestProvider";
import { sizeToString } from "../scripts/sizeToString";
import { BoldText } from "../components/BoldText";
import { ReactComponent as DeleteIcon } from "../static/delete.svg"
import { ReactComponent as FileIcon } from "../static/file.svg"

const File = () => {
    const [fileList, setFileList] = useState([]);

    const browseFiles = () => {
        window.document.getElementById('file-input').click();
    }

    const uploadFile = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) {
            return;
        }
        const form = new FormData();
        form.append("formFile", selectedFile);

        sendShareFileRequest(form, () => {
            sendGetFilesRequest({}, setFileList, () => {});
        }, (error) => {
            alert("Unexpected error");
            console.log(error);
        });
    }

    const deleteFile = (file) => {
        sendUnshareFileRequest(file.id, () => {
            sendGetFilesRequest({}, setFileList, () => {});
        }, (error) => {
            alert("Unexpected error");
            console.log(error);
        })
    }

    useEffect(() => {
        sendGetFilesRequest({}, setFileList, () => {});
    }, [])

    return (
        <Container component="main">
            <Button 
                type="button"
                variant="contained"
                onClick={browseFiles}
                sx={{ mt: 3, mb: 2, backgroundColor: '#00BBBB', color: '#FFFFFF', minWidth: '150px' }} 
            >
                Додати
            </Button>
            <Input 
                id="file-input"
                type="file" 
                onChange={uploadFile}
                sx={{ display: "none"}} 
            />
            <List sx={{ width: "100%"}}>
                { fileList && (
                    <>
                        <ListItem secondaryAction={<IconButton disabled/>}>
                            <ListItemIcon/>
                            <ListItemText primary={<BoldText>Ім'я</BoldText>} sx={{ width: "60%"}}/>
                            <ListItemText primary={<BoldText>Дата завантаження</BoldText>} sx={{ width: "30%"}}/>
                            <ListItemText primary={<BoldText>Розмір</BoldText>} sx={{ width: '10%' }} />
                        </ListItem>
                        <Divider/>
                        {
                            fileList.map((file) => (
                                <>
                                    <ListItem 
                                        secondaryAction={
                                            <IconButton edge="end" aria-label="delete" onClick={() => deleteFile(file)}>
                                                <SvgIcon component={DeleteIcon} sx={{ color: '#000000' }} inheritViewBox />
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

export {File};