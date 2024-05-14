import React, {useRef, useState} from "react";
import {
    Button,
    Card,
    Stack,
    Snackbar,
    Alert,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    CircularProgress, Box
} from "@mui/material";
import axios from "axios";
import {useSelectedLSA} from "@/contexts/SelectedLSAContext";
import {useTheme} from "@mui/material/styles";
import ContactUsBox from "@/components/ContactUsBox";
import AudioPlayerLocal from "../audio/AudioPlayerLocal";

interface AudioUploadProps {
    setAudioSelection: (value: "record" | "upload" | "noaudio" | null) => void;
}

export default function AudioUpload() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [open, setOpen] = useState<boolean>(false);  // controls the modal visibility
    const [uploadStatus, setUploadStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [fileName, setFileName] = useState('');
    const {selectedLsaId, setAudioFileUrl, localAudioSource, setLocalAudioSource} = useSelectedLSA();
    const theme = useTheme();

    const handleUpload = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
            // Check if the file type is allowed
            setFileName(file.name);
            if (["audio/mpeg", "audio/ogg", "audio/wav"].includes(file.type)) {
                setLocalAudioSource(file);
            } else {
                // Handle unsupported file type
                setSnackbarMessage("Unsupported file type. Please select an MP3, OGG, or WAV file.");
                setOpenSnackbar(true);
            }
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

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
            <Typography>File uploaded successfully!</Typography>
        );
    };

    const errorUI = () => {
        return (
            <Stack justifyContent={"center"}>
                <Typography>Our apologies: The following has occurred:</Typography>
                <Typography color={"error"}></Typography>
                <ContactUsBox/>
            </Stack>
        )
    }

    return (
        <Box sx={{mb:1}} >
            <Stack>
                <Button variant={"outlined"} onClick={handleUpload} sx={{maxWidth: 150}}>Upload File</Button>
                <input
                    type="file"
                    style={{display: "none"}}
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".mp3,.ogg,.wav"
                />
                {fileName && (
                    <Typography>{fileName}</Typography>
                )}
                {localAudioSource && (
                    <AudioPlayerLocal />
                )}
            </Stack>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="error" sx={{width: '100%'}}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            <Dialog open={open} onClose={() => {
                setOpen(false);
                setUploadStatus('loading');
            }} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">File Upload</DialogTitle>
                <DialogContent>
                    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                        {uploadStatus === 'loading' && loadingUI()}
                        {uploadStatus === 'success' && successUI()}
                        {uploadStatus === 'error' && errorUI()}
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    );
}
