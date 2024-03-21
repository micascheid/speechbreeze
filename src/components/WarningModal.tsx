import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import React, { FC } from 'react';
import {bool} from "yup";
import {useTheme} from "@mui/material/styles";

interface WarningModalProps {
    open: boolean;
    warningMessage: string;
    handleClose: () => void;
    handleContinue: () => void;
}

const WarningModal = ({ open, warningMessage, handleClose, handleContinue }: WarningModalProps) => {
    const theme = useTheme();
    return (

        <Dialog
            open={open}
            onClose={handleClose}
        >
            <DialogTitle color={theme.palette.error.main} sx={{textAlign: 'center', fontSize: '2rem'}}>{"Warning"}</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ textAlign: 'center', whiteSpace: 'pre-wrap' }}>
                    {warningMessage}
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

    );
};

export default WarningModal;