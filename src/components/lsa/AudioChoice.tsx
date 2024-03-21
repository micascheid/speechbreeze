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

interface AudioChoiceProps {
    setAudioSelection: (value: "record" | "upload" | "noaudio" | null) => void;
}

export default function AudioChoice({ setAudioSelection }: AudioChoiceProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [open, setOpen] = useState<boolean>(false);  // controls the modal visibility
    const [uploadStatus, setUploadStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const {selectedLsaId, setAudioFileUrl} = useSelectedLSA();
    const theme = useTheme();



    const handleUpload = () => {
        setAudioSelection("upload");
        fileInputRef.current?.click();
    };

    const handleRecord = () => {
        setAudioSelection("record");
    }

    const handleNoAudio = () => {
        setAudioSelection("noaudio");
    }

    const uploadAudio = async (file: any) => {
        setOpen(true);
        setUploadStatus('loading');
        const formData = new FormData();
        formData.append('audio', file);
        if (selectedLsaId !== null) {
            formData.append('lsa_id', selectedLsaId.toString());
        }
        try {
            const response = await axios.post('http://127.0.0.1:5000/upload-audio', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // This header tells the server about the type of the content
                },
            });
            setUploadStatus('success');
            setAudioFileUrl(response.data.file_url);

        } catch (error: any) {
            console.log("Error message", error.message);
            setUploadStatus('error');
            if (error.response) {
                //The request was made and the server responded with a status code that falls out of the range of 2xx
                console.log("Error data", error.response.data);
                console.log("Error status", error.response.status);
                console.log("Error headers", error.response.headers);
            } else if (error.request) {
                //The request was made but no response was received
                console.log("No response received", error.request);
            }

            console.error("Error uploading audio:", error);
        }
    }


    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log("handle file change");
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
            // Check if the file type is allowed
            if (["audio/mpeg", "audio/ogg", "audio/wav"].includes(file.type)) {
                console.log("File chosen:", file.name);
                await uploadAudio(file);
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
        <Card>
            <Stack direction={"row"} spacing={2}>
                <Button onClick={handleRecord}>Record</Button>
                <Button onClick={handleUpload} >Upload File</Button>
                <input
                    type="file"
                    style={{display: "none"}}
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".mp3,.ogg,.wav"
                />
                <Button onClick={handleNoAudio}>
                    No Audio
                </Button>
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
        </Card>
    );
}
