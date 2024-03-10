import {Button, Dialog, TextField, DialogActions, DialogContent, DialogTitle, IconButton} from "@mui/material";
import axios from "axios";
import {Patient, PatientNew} from "@/data/Patients";
import React, {useEffect, useState} from "react";
import useUser from "@/hooks/useUser";
import AddBoxIcon from '@mui/icons-material/AddBox';
import usePatients from "@/hooks/lsa/usePatients";


export const NewPatientForm = () => {
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [newPatientData, setNewPatientData] = useState<PatientNew>({slp_uid: '', name: '', birthdate: new Date()});
    const [saveError, setSaveError] = useState<string | null>(null);
    const {uid: slp_id} = useUser() || {};
    const {patients, isLoading: isPatientsLoading, isError: isPatientsError, mutatePatients} = usePatients();

    useEffect(() => {
        if (saveError) {
            setTimeout(() => {
                setSaveError(null);
            }, 5000)
        }
    }, [saveError]);


    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
        setSaving(false);
        setNewPatientData({slp_uid: '', name: '', birthdate: new Date()});
        setSaveError(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPatientData({...newPatientData, [e.target.name]: e.target.value});
    };

    const checkName = (): boolean => {
        const duplicate = patients.some((patient: Patient) => patient.name === newPatientData.name);
        if (duplicate) {
            setSaveError('Patient name already exists');
            return false;
        }
        return true;
    };

    const saveNewPatient = async () => {
        if (!checkName()) return;
        setSaving(true);
        try {
            console.log("in try", slp_id);
            await axios.post('http://127.0.0.1:5000/add-patient', {...newPatientData, slp_id: slp_id});
            await mutatePatients(`/patients?uid=${slp_id}`);
            handleClose();
        } catch (error) {
            console.error(error);
            setSaveError('Failed to save the patient');
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <IconButton onClick={handleOpen} disabled={isPatientsLoading}>
                <AddBoxIcon fontSize={"large"} color={"primary"}/>
            </IconButton>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add Patient</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Name"
                        type="text"
                        fullWidth
                        name="name"
                        value={newPatientData.name}
                        onChange={handleChange}
                        error={!!saveError}
                        helperText={saveError}
                    />
                    <TextField
                        margin="dense"
                        label="Birthdate"
                        type="date"
                        fullWidth
                        name="birthdate"
                        value={newPatientData.birthdate}
                        onChange={handleChange}
                        InputLabelProps={{shrink: true}}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" disabled={saving}>
                        Cancel
                    </Button>
                    <Button onClick={saveNewPatient} color="primary" disabled={saving}>
                        {saving ? 'Saving...' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>

    );
};