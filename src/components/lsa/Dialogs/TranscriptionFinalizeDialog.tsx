import {Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import React, {useState} from "react";
import WarningModal from "@/components/WarningModal";

type TranscriptionFinalizeProps = {
    setFinalize: (finalize: boolean) => void;
    disabled: boolean,
}

export default function TranscriptionFinalize({setFinalize, disabled}: TranscriptionFinalizeProps) {
    const [open, setOpen] = useState<boolean>(false);
    const message: string = "Once finalized you cannot change the transcription.\nWould you still like to continue?"
    const handleContinue = () => {
        setFinalize(true);
        setOpen(false);
    }
    const handleClose = () => {
        setOpen(false);
    }

    const handleOpen = () => {
        setOpen(true);
    }

    return (
        <Box>
            <Button variant={"outlined"} onClick={handleOpen} disabled={disabled} sx={{marginTop: '1em'}}>Finalize Transcription</Button>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle color='warning.main' sx={{textAlign: 'center', fontSize: '1.3rem'}}>{"Finalizing Transcription"}</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{textAlign: 'center', whiteSpace: 'pre-wrap'}}>
                        {message}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleContinue} autoFocus>
                        Continue
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};