import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Typography
} from "@mui/material";
import React, {useState} from "react";



export default function AudioFinalizeDialog() {
    const [open, setOpen] = useState<boolean>(false);

    const handleClose = () => {
        setOpen(false);
    }

    return (

        <Dialog open={open} onClose={handleClose} sx={{
            "& .MuiDialog-paper": {
                width: {xs: '80%', sm: '30%'},
                mx: 'auto',
            },
        }}>
            <DialogTitle>Finalize Audio</DialogTitle>
            <DialogContentText sx={{ textAlign: 'center', whiteSpace: 'pre-wrap' }}>
                You cannot change the audio for this LSA once you finalize.\nWould you like to continue?
            </DialogContentText>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button color="primary">
                    Continue
                </Button>
            </DialogActions>
        </Dialog>
    )
}