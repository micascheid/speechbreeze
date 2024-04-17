import { Dialog, DialogTitle } from '@mui/material';

interface SavingDialogProps {
    open: boolean;
}

const SavingDialog = ({open}: SavingDialogProps) => {
    return (
        <Dialog open={open}>
            <DialogTitle>Saving...</DialogTitle>
        </Dialog>
    );
}

export default SavingDialog;