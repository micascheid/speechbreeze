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
import {useTheme} from "@mui/material/styles";
import {NewPatientForm} from "@/components/lsa/Dialogs/NewPatientForm";

export default function PatientSelector() {
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [selectedLsa, setSelectedLsa] = useState<Lsa | null>(null);
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false); // New state for handling the saving state
    const [newPatientData, setNewPatientData] = useState<PatientNew>({slp_uid: '', name: '', birthdate: new Date()});
    const [saveError, setSaveError] = useState<string | null>(null);
    const {patients, isLoading: isPatientsLoading, isError: isPatientsError, mutatePatients} = usePatients();
    const [lsaDialogOpen, setLsaDialogOpen] = useState(false);
    const [savingLsa, setSavingLsa] = useState(false);
    const [newLsaData, setNewLsaData] = useState<{ name: string }>({ name: '' });
    const [lsaSaveError, setLsaSaveError] = useState<string | null>(null);
    const {uid: slp_id} = useUser() || {};
    const theme = useTheme();
    const {lsas, isLoading: isLsasLoading, isError: isLsasError, mutateLsas} = useLsa();


    const handleLsaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewLsaData({ name: e.target.value });
    };



    const saveNewLsa = async () => {
        setSavingLsa(true);
        try {
            const response = await axios.post('http://127.0.0.1:5000/create-lsa', {...newLsaData, patient_id: selectedPatient?.patient_id});
            await mutateLsas(`/lsa?uid=${slp_id}`);
            setLsaDialogOpen(false);
            setNewLsaData({ name: '' });
            setSavingLsa(false);
        } catch (error) {
            console.error(error);
            setSavingLsa(false);
        }
    };


    // Handle patient row click
    const handlePatientRowClick = (patient: Patient) => {
        setSelectedPatient(patient);
        setSelectedLsa(null);
    };

    // Handle LSA row click
    const handleLsaRowClick = (lsa: Lsa) => {
        setSelectedLsa(lsa);
    };

    const emptyRowsCountPatients = 5 - (isPatientsLoading ? 0 : patients.length);

    console.log("Patients: ", patients);
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
                <TableContainer component={Paper} style={{maxHeight: `${36 * 8}px`, overflow: 'auto'}}>
                    <Box flexDirection={"row"} sx={{display: 'flex', justifyContent: 'space-between'}}>
                        <Typography variant="h3" sx={{mb: 1, ml: 1}}>
                            Patients
                        </Typography>
                        <NewPatientForm />
                    </Box>
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
                                        <TableRow key={i} onClick={() => handlePatientRowClick(patient)}
                                                  sx={{
                                            backgroundColor: selectedPatient && selectedPatient.patient_id === patient.patient_id ? theme.palette.primary.lighter : 'inherit', // Example with MUI sx prop
                                            '&:hover': {
                                                backgroundColor: theme.palette.primary.lighter,
                                            },
                                        }}
                                        >
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
                    {/*</Box>*/}
                </TableContainer>
            </Grid>

            <Grid item container xs={12} sm={6} spacing={2} style={{flexGrow: 1}}>
                <Grid item xs={12} style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                    <TableContainer component={Paper} sx={{mb: 2}} style={{maxHeight: `${36 * 8}px`, minHeight: `${36 * 7}px`,  overflow: 'auto'}}>
                        <Typography variant="h3" sx={{mb: 1, ml: 1}}>
                            Patient LSA&apos;s
                        </Typography>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>MLU</TableCell>
                                    <TableCell>TNW</TableCell>
                                    <TableCell>WPS</TableCell>
                                    <TableCell>CPS</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {!selectedPatient ? (
                                    <TableRowsSkeleton rows={5} columns={6} animate={false}/>
                                ) : (
                                    // Display the LSAs data
                                    <>
                                        {lsas
                                            .filter((lsa: Lsa) => lsa.patient_id === selectedPatient.patient_id)
                                            .map((lsa: Lsa, i: number) => {
                                                const date = new Date(lsa.date);
                                                const formattedDate = date.toLocaleDateString();
                                                const formattedTime = date.toLocaleTimeString('en-us', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: true
                                                });
                                                console.log(i);
                                                return (
                                                    <TableRow key={i} onClick={() => handleLsaRowClick(lsa)}
                                                              sx={{
                                                                      backgroundColor: selectedLsa && selectedLsa.lsa_id === lsa.lsa_id ? theme.palette.primary.lighter : 'inherit', // Example with MUI sx prop
                                                                      '&:hover': {
                                                                          backgroundColor: theme.palette.primary.lighter,
                                                                      },
                                                                  }}
                                                                  >
                                                        <TableCell>{lsa.name}</TableCell>
                                                        <TableCell sx={{width: '30%'}}>{`${formattedDate} ${formattedTime}`}</TableCell>
                                                        <TableCell>{lsa.mlu}</TableCell>
                                                        <TableCell>{lsa.tnw}</TableCell>
                                                        <TableCell>{lsa.wps}</TableCell>
                                                        <TableCell>{lsa.cps}</TableCell>
                                                    </TableRow>
                                                );
                                            })
                                        }
                                        {/*Empty rows if < 5 lsas*/}
                                        {
                                            (() => {
                                                const numLsas = lsas.filter((lsa: Lsa) => lsa.patient_id === selectedPatient.patient_id).length;
                                                const emptyRowsToRender = Math.max(0, 5 - numLsas);
                                                return Array.from({ length: emptyRowsToRender }, (_, index) => (
                                                    <TableRow key={`empty-${index}`} style={{ height: 36 }}>
                                                        <TableCell colSpan={5} />
                                                    </TableRow>
                                                ));
                                            })()
                                        }
                                    </>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Stack direction={"row"} spacing={1}>
                        <Button variant={"contained"} onClick={() => setLsaDialogOpen(true)} color="primary" disabled={!selectedPatient}>
                            Start New LSA
                        </Button>
                        <Button variant={"contained"} color="secondary" disabled={!selectedLsa}>
                            Continue LSA
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
            <Dialog open={lsaDialogOpen} onClose={() => setLsaDialogOpen(false)}>
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
                    <Button onClick={() => setLsaDialogOpen(false)} color="primary" disabled={savingLsa}>
                        Cancel
                    </Button>
                    <Button onClick={saveNewLsa} color="primary" disabled={savingLsa}>
                        {savingLsa ? 'Saving...' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
}