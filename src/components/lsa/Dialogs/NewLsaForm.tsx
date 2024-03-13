import {Patient, PatientNew} from "@/data/Patients";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, TextField} from "@mui/material";
import React, {useState} from "react";
import {bool} from "yup";
import {Lsa} from "@/data/Lsa";
import axios, { AxiosError } from "axios";
import useLsas from "@/hooks/lsa/useLsas";
import useUser from "@/hooks/useUser";
import {useSelectedLSA} from "@/contexts/SelectedLSAContext";
import AddBoxIcon from "@mui/icons-material/AddBox";


type NewLsaFormProps = {
    selectedPatient: Patient | null;
    selectedLsa: Lsa | null;
}

export default function NewLsaForm({selectedPatient, selectedLsa}: NewLsaFormProps) {
    const [open, setOpen] = useState<boolean>(false);
    const [savingLsa, setSavingLsa] = useState(false);
    const [newLsaData, setNewLsaData] = useState<{ name: string }>({ name: '' });
    const [lsaSaveError, setLsaSaveError] = useState<string | null>(null);
    const {lsas, isLoading: isLsasLoading, isError: isLsasError, mutateLsas} = useLsas();
    const {uid: slp_id} = useUser() || {};

    const { selectedLsaId, setSelectedLsaId } = useSelectedLSA();

    const handleClose = () => {
        setOpen(false);
        setSavingLsa(false);
        setNewLsaData({ name: '' });
        setLsaSaveError(null);
    }

    const handleLsaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewLsaData({ name: e.target.value });
    };

    const validateLsaName = (name: string): string => {
        const maxLength = 255;
        const regex = /^[a-zA-Z0-9-_ ]+$/; // Allow letters, numbers, hyphens, underscores, and spaces

        if (name.length === 0) {
            return "Name cannot be empty.";
        }
        if (name.length > maxLength) {
            return "Name must be 255 characters or less.";
        }
        if (!regex.test(name)) {
            return "Name contains invalid characters. Only letters, numbers, hyphens, underscores, and spaces are allowed.";
        }
        // Trim leading and trailing spaces (consider doing this before setting the state)
        if (name.trim() !== name) {
            return "Name cannot start or end with a space.";
        }
        return ""; // Return an empty string to indicate valid name
    };

    const handleContinue = () => {
        if (selectedLsa) {
            setSelectedLsaId(selectedLsa.lsa_id);
        }
    }


    const saveNewLsa = async () => {
        const validationError = validateLsaName(newLsaData.name);
        if (validationError !== "") {
            setLsaSaveError(validationError);
            setSavingLsa(false);
            return; // Prevent further execution
        }

        setSavingLsa(true);
        try {
            await axios.post('http://127.0.0.1:5000/create-lsa', {...newLsaData, patient_id: selectedPatient?.patient_id, slp_id: slp_id});
            await mutateLsas(`/lsa?uid=${slp_id}`);
            handleClose();
        } catch (error: any) {
            console.error(error);
            setSavingLsa(false);
            let errorMsg = 'Error saving LSA. Please, try again.';
            if (error.response) {
                // The request was made and server responded with a status outside of the 2xx range
                errorMsg = error.response.data.message || 'Error saving LSA. Please, try again.';
            } else if (error.request) {
                // The request was made but no response was received
                errorMsg = 'We\'re having trouble saving at this time. Contact us or try again later';
            }
            setLsaSaveError(errorMsg);
        }
    };


    return (
        <>
            <Stack direction={"row"} spacing={1}>
                <IconButton onClick={() => setOpen(true)} disabled={!selectedPatient}>
                    <AddBoxIcon fontSize={"large"} color={!selectedPatient ? "secondary" : "primary"}/>
                </IconButton>
                {/*<Button variant={"contained"} color="secondary" disabled={!selectedLsa} onClick={handleContinue}>*/}
                {/*    Continue LSA*/}
                {/*</Button>*/}
            </Stack>
            <Dialog open={open} onClose={handleClose} sx={{
                "& .MuiDialog-paper": {
                    width: { xs: '80%', sm: '30%' },
                    mx: 'auto',
                },
            }}>
                <DialogTitle>Add LSA</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Name"
                        type="text"
                        fullWidth
                        name="name"
                        value={newLsaData.name}
                        onChange={handleLsaChange}
                        error={!!lsaSaveError}
                        helperText={lsaSaveError}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="primary" disabled={savingLsa}>
                        Cancel
                    </Button>
                    <Button onClick={saveNewLsa} color="primary" disabled={savingLsa}>
                        {savingLsa ? 'Saving...' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>

    );
};