import React, {useRef, useState} from "react";
import { Button, Card, Stack, Snackbar, Alert } from "@mui/material";

export default function AudioChoice() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
            // Check if the file type is allowed
            if (["audio/mpeg", "audio/ogg", "audio/wav"].includes(file.type)) {
                console.log("File chosen:", file.name);
                // Process the file here
            } else {
                // Handle unsupported file type
                console.log("Unsupported file type:", file.type);
                setSnackbarMessage("Unsupported file type. Please select an MP3, OGG, or WAV file.");
                setOpenSnackbar(true);
            }
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Card>
            <Stack direction={"row"} spacing={2}>
                <Button onClick={() => console.log("Record button clicked")}>Record</Button>
                <Button onClick={handleUploadClick}>Upload File</Button>
                <input
                    type="file"
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".mp3,.ogg,.wav"
                />
                <Button onClick={() => console.log("Transcript button clicked")}>I already have a transcript</Button>
            </Stack>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Card>
    );
}
