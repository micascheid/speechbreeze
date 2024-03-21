import {Box, Button, CircularProgress, Dialog, DialogContent, DialogTitle, Stack, Typography} from "@mui/material";
import React, {useState} from "react";
import ContactUsBox from "@/components/ContactUsBox";

type AudioUploadStatusProps = {
    uploadStatus: 'uploading' | 'success' | 'error' | null;
    setUploadStatus: (status: 'uploading' | 'success' | 'error' | null) => void;
}

export default function AudioUploadStatus({uploadStatus: uploadStatus, setUploadStatus: setUploadStatus}: AudioUploadStatusProps) {
    const [open, setOpen] = useState(true);
    console.log("upload status:", uploadStatus);
    const loadingUI = () => {
        return (
            <>
                <CircularProgress/>
                <Typography>Loading...</Typography>
            </>
        );
    };

    const successUI = () => {
        return (
            <Stack justifyContent={"center"}>
                <Typography>File uploaded successfully!</Typography>
                <Button variant={"outlined"} onClick={handleClose}>Close</Button>
            </Stack>
        );
    };

    const errorUI = () => {
        return (
            <Stack justifyContent={"center"}>
                <Typography>Our apologies: The following has occurred:</Typography>
                <Typography color={"error"}></Typography>
                <ContactUsBox/>
                <Button variant={"outlined"} onClick={handleClose}>Close</Button>
            </Stack>
        )
    }

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <Dialog open={open} onClose={() => {
            setOpen(false);
            setUploadStatus(null);
        }} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">File Upload</DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                    {uploadStatus === 'uploading' && loadingUI()}
                    {uploadStatus === 'success' && successUI()}
                    {uploadStatus === 'error' && errorUI()}
                </Box>
            </DialogContent>
        </Dialog>
    )
}