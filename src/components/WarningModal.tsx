import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import React, { FC } from 'react';
import {bool} from "yup";

interface WarningModalProps {
    open: boolean;
    warningMessage: string;
    handleClose: () => void;
    handleContinue: () => void;
}

const WarningModal = ({ open, warningMessage, handleClose, handleContinue }: WarningModalProps) => {
    return (

        <Dialog
            open={open}
            onClose={handleClose}
        >
            <DialogTitle>{"Warning"}</DialogTitle>
            <DialogContent>
                <DialogContentText>
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