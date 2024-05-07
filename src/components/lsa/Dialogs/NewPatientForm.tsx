import {
    Button,
    Dialog,
    TextField,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography
} from "@mui/material";
import axios from "axios";
import {Patient, PatientNew} from "@/data/Patients";
import React, {useEffect, useState} from "react";
import useUser from "@/hooks/useUser";
import AddBoxIcon from '@mui/icons-material/AddBox';
import usePatients from "@/hooks/lsa/usePatients";

type NewPatientFormProps = {
    onPatientAdd: (patient: Patient) => void;
}

export const NewPatientForm = ({onPatientAdd}: NewPatientFormProps) => {
    const [open, setOpen] = useState(false);

    const [saving, setSaving] = useState(false);
    const [newPatientData, setNewPatientData] = useState<PatientNew>({slp_uid: '', name: '', age: 0});
    const [saveError, setSaveError] = useState<string | null>(null);
    const {uid: slp_id} = useUser()?.user || {};
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
        setNewPatientData({slp_uid: '', name: '', age: 0});
        setSaveError(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPatientData({...newPatientData, [e.target.name]: e.target.value, [e.target.name]: e.target.value});
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
            await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/patients/add-patient`, {...newPatientData, slp_id: slp_id});
            const updatedPatients = await mutatePatients(`/patients/${slp_id}`);
            if (updatedPatients && updatedPatients.length > 0)
            {
                onPatientAdd(updatedPatients[updatedPatients.length - 1]);
                handleClose();
            } else {
                setSaveError('Failed to fetch the patient. Contact us or try again later');
            }
        } catch (error) {
            console.error(error);
            setSaveError('Failed to save the patient. Contact us or try again later');
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <IconButton onClick={handleOpen} disabled={isPatientsLoading}>
                <AddBoxIcon fontSize={"large"} color={"primary"}/>
            </IconButton>
            <Dialog open={open} onClose={handleClose} sx={{
                "& .MuiDialog-paper": {
                    width: { xs: '80%', sm: '30%' },
                    mx: 'auto',
                },
            }}>
                <DialogTitle>Add Patient</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary">Fields marked with * are required</Typography>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Name *"
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
                        label="Age"
                        type="number"
                        fullWidth
                        name="age"
                        value={newPatientData.age}
                        onChange={handleChange}
                        InputLabelProps={{shrink: true}}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" disabled={saving}>
                        Cancel
                    </Button>
                    <Button onClick={saveNewPatient} color="primary" disabled={saving || newPatientData.name === ''}>
                        {saving ? 'Saving...' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>

    );
};