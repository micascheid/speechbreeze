import React, {useEffect, useState} from "react";
import {
    Grid,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Stack,
    Box, Skeleton
} from "@mui/material";
import usePatients from "@/hooks/lsa/usePatients";
import axios from "axios";
import useUser from "@/hooks/useUser";
import { Lsa } from "@/data/Lsa";
import { PatientNew, Patient} from "@/data/Patients";
import useLsa from "@/hooks/lsa/useLsa";

export default function PatientSelector() {
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [selectedLsa, setSelectedLsa] = useState<Lsa | null>(null);
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false); // New state for handling the saving state
    const [newPatientData, setNewPatientData] = useState<PatientNew>({slp_uid: '', name: '', birthdate: new Date()});
    const [saveError, setSaveError] = useState<string | null>(null);
    const { patients, isLoading: isPatientsLoading, isError: isPatientsError, mutatePatients } = usePatients();
    const { uid: slp_id } = useUser() || {};
    const { lsas, isLoading: isLsasLoading, isError: isLsasError, mutateLsas } = useLsa();
    useEffect(() => {
        if (saveError) {
            setTimeout(() => {
                setSaveError(null);
            }, 5000)
        }
    },[saveError]);

    if (isPatientsError) return <div>Error loading patients</div>;
    if (isPatientsError || !patients) return <div>Loading...</div>;

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
            // setSelectedPatient(newPatientData);
        } catch (error) {
            console.error(error);
            setSaveError('Failed to save the patient');
        } finally {
            setSaving(false);
        }
    };
    // Handle patient row click
    const handlePatientRowClick = (patient: Patient) => {
        setSelectedPatient(patient);
        setSelectedLsa(null); // Reset selected LSA when different patient is selected.
    };

    // Handle LSA row click
    const handleLsaRowClick = (lsa: Lsa) => {
        setSelectedLsa(lsa);
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
                <TableContainer component={Paper}>
                    <Box style={{ maxHeight: 48 * 5, overflow: 'auto'}}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Birthdate</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {patients && patients.map((patient: Patient, i: number) => (
                                    <TableRow key={i} onClick={() => handlePatientRowClick(patient)}>
                                        <TableCell>{patient.slp_uid}</TableCell>
                                        <TableCell>{patient.name}</TableCell>
                                        <TableCell>{patient.birthdate.toDateString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>
                </TableContainer>
            </Grid>

            <Grid item container xs={12} sm={6} spacing={2} style={{ flexGrow: 1 }}>
                <Grid item xs={12} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <TableContainer component={Paper} style={{ height: 48 * 5, marginBottom: '16px' }}>
                        <Box style={{ maxHeight: 48 * 5, overflow: 'auto'}}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell>MLU</TableCell>
                                        <TableCell>TNW</TableCell>
                                        <TableCell>WPS</TableCell>
                                        <TableCell>CPS</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {!selectedPatient ? (
                                        // Display 5 disabled rows if no patient selected
                                        new Array(5).fill(null).map((_, index) => (
                                            <TableRow key={index}>
                                                <TableCell>-</TableCell>
                                                <TableCell>-</TableCell>
                                                <TableCell>-</TableCell>
                                                <TableCell>-</TableCell>
                                                <TableCell>-</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        // Display the LSAs data
                                        lsas
                                            .filter((lsa: Lsa) => lsa.patient_id === selectedPatient.patient_id)
                                            .map((lsa: Lsa, i: number) => (
                                                <TableRow key={i} onClick={() => handleLsaRowClick(lsa)}>
                                                    <TableCell>{lsa.date}</TableCell>
                                                    <TableCell>{lsa.mlu}</TableCell>
                                                    <TableCell>{lsa.tnw}</TableCell>
                                                    <TableCell>{lsa.wps}</TableCell>
                                                    <TableCell>{lsa.cps}</TableCell>
                                                </TableRow>
                                            ))
                                    )}
                                </TableBody>
                            </Table>
                        </Box>
                    </TableContainer>
                    <Stack direction={"row"} spacing={1}>
                        <Button variant="contained" color="primary" disabled={!selectedPatient}>
                            Start New LSA
                        </Button>
                        <Button variant="contained" color="secondary" disabled={!selectedLsa}>
                            Continue LSA
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
        </Grid>
    );
}