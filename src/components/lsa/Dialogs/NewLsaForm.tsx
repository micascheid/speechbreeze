import {Patient, PatientNew} from "@/data/Patients";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField} from "@mui/material";
import React, {useState} from "react";
import {bool} from "yup";
import {Lsa} from "@/data/Lsa";
import axios, { AxiosError } from "axios";
import useLsa from "@/hooks/lsa/useLsa";
import useUser from "@/hooks/useUser";


type NewLsaFormProps = {
    selectedPatient: Patient | null;
    selectedLsa: Lsa | null;
}

export default function NewLsaForm({selectedPatient, selectedLsa}: NewLsaFormProps) {
    const [open, setOpen] = useState<boolean>(false);
    const [savingLsa, setSavingLsa] = useState(false);
    const [newLsaData, setNewLsaData] = useState<{ name: string }>({ name: '' });
    const [lsaSaveError, setLsaSaveError] = useState<string | null>(null);
    const {lsas, isLoading: isLsasLoading, isError: isLsasError, mutateLsas} = useLsa();
    const {uid: slp_id} = useUser() || {};

    const handleClose = () => {
        setOpen(false);
        setSavingLsa(false);
        setNewLsaData({ name: '' });
        setLsaSaveError(null);
    }

    const handleLsaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewLsaData({ name: e.target.value });
    };

    const saveNewLsa = async () => {
        setSavingLsa(true);
        try {
            await axios.post('http://127.0.0.1:5000/create-lsa', {...newLsaData, patient_id: selectedPatient?.patient_id});
            await mutateLsas(`/lsa?uid=${slp_id}`);
            handleClose();
        } catch (error: any) {
            console.error(error);
            setSavingLsa(false);
            let errorMsg = 'Error saving LSA. Please, try again.';
            if (error.response) {
                // The request was made and server responded with a status outside of the 2xx range
                errorMsg = error.response.data.message;
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
                <Button variant={"contained"} onClick={() => setOpen(true)} color="primary" disabled={!selectedPatient}>
                    Start New LSA
                </Button>
                <Button variant={"contained"} color="secondary" disabled={!selectedLsa}>
                    Continue LSA
                </Button>
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