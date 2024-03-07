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
    Box, Skeleton, Typography, IconButton, DialogTitle, DialogContent, TextField, DialogActions, Dialog
} from "@mui/material";
import AddBoxIcon from '@mui/icons-material/AddBox';
import usePatients from "@/hooks/lsa/usePatients";
import axios from "axios";
import useUser from "@/hooks/useUser";
import {Lsa} from "@/data/Lsa";
import {PatientNew, Patient} from "@/data/Patients";
import useLsa from "@/hooks/lsa/useLsa";
import TableRowsSkeleton from "@/components/skeletons/TableRowsSkeleton";

export default function PatientSelector() {
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [selectedLsa, setSelectedLsa] = useState<Lsa | null>(null);
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false); // New state for handling the saving state
    const [newPatientData, setNewPatientData] = useState<PatientNew>({slp_uid: '', name: '', birthdate: new Date()});
    const [saveError, setSaveError] = useState<string | null>(null);
    const {patients, isLoading: isPatientsLoading, isError: isPatientsError, mutatePatients} = usePatients();
    const {uid: slp_id} = useUser() || {};
    const {lsas, isLoading: isLsasLoading, isError: isLsasError, mutateLsas} = useLsa();
    useEffect(() => {
        if (saveError) {
            setTimeout(() => {
                setSaveError(null);
            }, 5000)
        }
    }, [saveError]);


    const handleClose = () => {
        setOpen(false);
        setSaving(false);
        setSelectedPatient(null);
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
            const response = await axios.post('http://127.0.0.1:5000/add-patient', {...newPatientData, slp_id: slp_id});
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

    const handlePatientAdd = () => {
        setOpen(true);
    }
    const emptyRowsCountPatients = 5 - (isPatientsLoading ? 0 : patients.length);
    const emptyRowsCountLsa = 5 - (isLsasLoading ? 0 : lsas.length);
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
                <TableContainer component={Paper}>
                    <Box flexDirection={"row"} sx={{display: 'flex', justifyContent: 'space-between'}}>
                        <Typography variant="h3" sx={{mb: 1, ml: 1}}>
                            Patients
                        </Typography>
                        <IconButton size={"large"} onClick={handlePatientAdd}>
                            <AddBoxIcon fontSize={"large"} color={"primary"}/>
                        </IconButton>
                    </Box>

                    <Box style={{minHeight: `${36 * 5}px`, overflow: 'auto'}}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Birthdate</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {isPatientsLoading ? (
                                    <TableRowsSkeleton rows={5} columns={2} animate={true}/>
                                ) : isPatientsError ? (
                                    <TableRow>
                                        <TableCell colSpan={2} align="center">{"Error fetching patients"}</TableCell>
                                    </TableRow>
                                ) : (
                                    <>
                                        {patients.map((patient, i) => (
                                            <TableRow key={i} onClick={() => handlePatientRowClick(patient)}>
                                                <TableCell>{patient.name}</TableCell>
                                                <TableCell>{typeof patient.birthdate === 'object' ? patient.birthdate.toDateString() : patient.birthdate}</TableCell>
                                            </TableRow>
                                        ))}
                                        {Array.from(new Array(emptyRowsCountPatients), (x, i) => i).map((index) => (
                                            <TableRow key={`empty-${index}`}>
                                                <TableCell colSpan={2}/>
                                            </TableRow>
                                        ))}
                                    </>
                                )}
                            </TableBody>
                        </Table>
                    </Box>
                </TableContainer>
            </Grid>

            <Grid item container xs={12} sm={6} spacing={2} style={{flexGrow: 1}}>
                <Grid item xs={12} style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                    <TableContainer component={Paper} sx={{mb: 2}}>
                        <Typography variant="h3" sx={{mb: 1, ml: 1}}>
                            Patient LSA&apos;s
                        </Typography>
                        <Box style={{minHeight: `${36 * 5}px`, overflow: 'auto'}}>
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
                                        <TableRowsSkeleton rows={5} columns={5} animate={false}/>
                                    ) : (
                                        // Display the LSAs data
                                        lsas
                                            .filter((lsa: Lsa) => lsa.patient_id === selectedPatient.patient_id)
                                            .map((lsa: Lsa, i: number) => {
                                                const date = new Date(lsa.date);
                                                const formattedDate = date.toLocaleDateString();
                                                const formattedTime = date.toLocaleTimeString('en-us', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: true
                                                });
                                                return (
                                                    <TableRow key={i} onClick={() => handleLsaRowClick(lsa)}>
                                                        <TableCell sx={{ width: '40%'}}>{`${formattedDate} ${formattedTime}`}</TableCell>
                                                        <TableCell>{lsa.mlu}</TableCell>
                                                        <TableCell>{lsa.tnw}</TableCell>
                                                        <TableCell>{lsa.wps}</TableCell>
                                                        <TableCell>{lsa.cps}</TableCell>
                                                    </TableRow>
                                                )
                                            })
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
        </Grid>
    );
}