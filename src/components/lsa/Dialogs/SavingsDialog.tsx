import { Dialog, DialogTitle } from '@mui/material';

interface SavingDialogProps {
    open: boolean;
}

const SavingDialog: React.FC<SavingDialogProps> = (props) => {
    return (
        <Dialog open={props.open}>
            <DialogTitle>Saving...</DialogTitle>
        </Dialog>
    );
}

export default SavingDialog;