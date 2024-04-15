import {Box, Dialog, DialogContent, DialogTitle, IconButton} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {useState} from "react";

export type InfoDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export default function InfoDialog({isOpen, onClose, title, children}: InfoDialogProps) {

    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogTitle sx={{typography: 'h4'}}>
                <Box display={"flex"} justifyContent={"space-between"}>
                    {title}
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent>
                {children}
            </DialogContent>
        </Dialog>
    );
};