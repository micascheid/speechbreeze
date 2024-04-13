import {Dialog, DialogContent, DialogTitle} from "@mui/material";

export type InfoDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export default function InfoDialog({isOpen, onClose, title, children}: InfoDialogProps) {
    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                {children}
            </DialogContent>
        </Dialog>
    );
};