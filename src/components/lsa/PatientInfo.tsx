import React, { useState, useEffect } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Select,
    MenuItem,
    SelectChangeEvent,
} from '@mui/material';
import axios from 'axios';
import { mutate } from 'swr';
import usePatients from "@/hooks/lsa/usePatients";
import useUser from "@/hooks/useUser";

type Patient = {
    patient_id: number,
    slp_id: string,
    name: string,
    birthdate: string
}

export default function PatientInfo() {
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false); // New state for handling the saving state
    const [newPatientData, setNewPatientData] = useState({ slp_uid: '', name: '', birthdate: '1997-06-16' });
    const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
    const [saveError, setSaveError] = useState<string | null>(null); // Updated to store error message
    const { patients, isLoading, isError, mutatePatients } = usePatients();
    const { uid: slp_id } = useUser() || {};

    useEffect(() => {
        if (saveError) {
            setTimeout(() => {
                setSaveError(null);
            }, 5000);
        }
    }, [saveError]);

    if (isError) return <div>Error loading patients</div>;
    if (isLoading || !patients) return <div>Loading...</div>;

    const handlePatientChange = (event: SelectChangeEvent) => {
        setSelectedPatient(event.target.value as string);
        if (event.target.value === 'new') {
            setOpen(true);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setSaving(false);
        setSelectedPatient(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> ) => {
        setNewPatientData({ ...newPatientData, [e.target.name]: e.target.value });
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
            const response = await axios.post('http://127.0.0.1:5000/add-patient', { ...newPatientData, slp_id: slp_id });
            await mutatePatients(`/patients?uid=${slp_id}`);
            handleClose();
            setSelectedPatient(newPatientData.name); // Select the newly added patient in the dropdown
        } catch (error) {
            console.error(error);
            setSaveError('Failed to save the patient');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <Select
                value={selectedPatient || ''}
                onChange={handlePatientChange}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
            >
                <MenuItem disabled value="">
                    <em>Select or add a new Patient...</em>
                </MenuItem>
                {patients.map((patient: Patient) => (
                    <MenuItem key={patient.patient_id} value={patient.name}>
                        {patient.name}
                    </MenuItem>
                ))}
                <MenuItem key="new" value="new">
                    Add New Patient
                </MenuItem>
            </Select>
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
                        InputLabelProps={{ shrink: true }}
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
        </div>
    );
}
