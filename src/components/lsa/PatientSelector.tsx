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
import usePatients from "@/hooks/lsa/usePatients";
import axios from "axios";
import useUser from "@/hooks/useUser";
import {Lsa} from "@/data/Lsa";
import {Patient} from "@/data/Patients";
import useLsas from "@/hooks/lsa/useLsas";
import TableRowsSkeleton from "@/components/skeletons/TableRowsSkeleton";
import {useTheme} from "@mui/material/styles";
import {NewPatientForm} from "@/components/lsa/Dialogs/NewPatientForm";
import NewLsaForm from "@/components/lsa/Dialogs/NewLsaForm";
import {useSelectedLSA} from "@/contexts/SelectedLSAContext";
import ButtonPulsing from "@/components/ButtonPulsing";
import useLsa from "@/hooks/lsa/useLsa";

import DeleteIcon from "@mui/icons-material/Delete";
import {openSnackbar} from "@/api/snackbar";
import {SnackbarProps} from "@/types/snackbar";

export default function PatientSelector() {
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [selectedLsa, setSelectedLsa] = useState<Lsa | null>(null);
    const {patients, isLoading: isPatientsLoading, isError: isPatientsError, mutatePatients} = usePatients();
    const {selectedLsaId, setSelectedLsaId, resetLsa} = useSelectedLSA();
    const {lsas, isLoading: isLsasLoading, isError: isLsasError, mutateLsas} = useLsas();
    const {lsa, mutateLsa} = useLsa();
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const [isDeletingLsa, setIsDeletingLsa] = useState<boolean>(false);
    const [openDeletePatient, setOpenDeletePatient] = useState<boolean>(false);
    const [isDeletingPatient, setIsDeletingPatient] = useState<boolean>(false);
    const {user} = useUser();
    const theme = useTheme();


    // Handle patient row click
    const handlePatientRowClick = (patient: Patient) => {
        setSelectedPatient(patient);
        setSelectedLsa(null);
    };

    // Handle LSA row click
    const handleLsaRowClick = (lsa: Lsa) => {
        setSelectedLsa(lsa);
    };

    const handleChosenLsa = () => {
        if (selectedLsa) {
            resetLsa();
            setSelectedLsaId(selectedLsa.lsa_id);
        }
    }

    const handleCloseDeleteDialog = (e: React.SyntheticEvent) => {
        e.stopPropagation();
        setOpenDeleteDialog(false);
    }

    const handleCloseDeletePatient = (e: React.SyntheticEvent) => {
        e.stopPropagation();
        setOpenDeletePatient(false);
    }


    const handleDeleteLsa = async () => {
        try {
            setIsDeletingLsa(true);
            await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/lsa/${selectedLsa?.lsa_id}/delete`);
            await mutateLsa(`/lsa/${selectedLsa?.lsa_id}`, false);
            await mutateLsas(`/lsas/${user?.uid}`);
            setOpenDeleteDialog(false);
            setSelectedLsaId(null);
            setSelectedLsa(null);
            openSnackbar({
                open: true,
                message: `Successfully deleted LSA`,
                variant: "alert",
                alert: {
                    color: "success",
                    variant: "filled"
                },
            } as SnackbarProps);
        } catch (err) {
            console.error(err);
            openSnackbar({
                open: true,
                message: `Failed to delete LSA: ${lsa?.name}`,
                variant: "alert",
                alert: {
                    color: "error",
                    variant: "filled"
                },
            } as SnackbarProps);
        } finally {
            setIsDeletingLsa(false);
            setOpenDeleteDialog(false);
        }
    }

    const handleDeletePatient = async () => {
        setIsDeletingPatient(true);
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/patients/${selectedPatient?.patient_id}/delete`);
            await mutatePatients(`/patients/${user?.uid}`);
            await mutateLsas(`/lsas/${user?.uid}`);
            await mutateLsa(`/lsa/${selectedLsa?.lsa_id}`);
            setOpenDeleteDialog(false);
            setOpenDeletePatient(false);
            setSelectedPatient(null);
            openSnackbar({
                open: true,
                message: `Deleted Patient ${selectedPatient?.name}`,
                variant: "alert",
                alert: {
                    color: "success",
                    variant: "filled"
                },
            } as SnackbarProps);
        } catch (error) {
            console.error(error);
            openSnackbar({
                open: true,
                message: `Failed to delete patient ${selectedPatient?.name}`,
                variant: "alert",
                alert: {
                    color: "error",
                    variant: "filled"
                },
            } as SnackbarProps);
        } finally { // This block will run regardless of whether an error occurred
            setIsDeletingPatient(false);
            setOpenDeletePatient(false);
        }
    }

    const emptyRowsCountPatients = patients.length > 5 ? 0 : (5 - (isPatientsLoading ? 0 : patients.length));

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
                <Stack direction={"row"} display={"flext"} justifyContent={"space-between"}>
                    <Box display={"flex"}>
                        <NewPatientForm onPatientAdd={(newPatient: Patient) => setSelectedPatient(newPatient)}/>
                        <Typography variant="h3" sx={{mb: 1, ml: 1}}>
                            Students
                        </Typography>
                    </Box>

                    {selectedPatient &&
                        <IconButton onClick={(e: React.MouseEvent) => { // Conditionally show button when LSA is selected
                            e.stopPropagation();
                            setOpenDeletePatient(true);
                        }}>
                            <Dialog
                                open={openDeletePatient}
                                onClose={handleCloseDeleteDialog}
                            >
                                <DialogTitle sx={{textAlign: 'center'}}>Delete Patient</DialogTitle>
                                <DialogContent>
                                    <Typography variant="body1" textAlign={"center"}>
                                        Are you sure you want to delete patient: <b>{selectedPatient.name}</b>?<br/>
                                        <u><b>All associated LSA&apos;s will be deleted too.</b></u>
                                    </Typography>
                                </DialogContent>
                                <DialogActions>
                                    <Button disabled={isDeletingPatient}
                                            onClick={handleCloseDeletePatient}>Cancel</Button>
                                    <Button disabled={isDeletingPatient} onClick={handleDeletePatient}
                                            color="error">Delete</Button>
                                </DialogActions>
                            </Dialog>
                            <DeleteIcon color={"error"}/>
                        </IconButton>}
                </Stack>
                <TableContainer component={Paper}
                                style={{maxHeight: `${36 * 7}px`, minHeight: `${36 * 7}px`, overflow: 'auto'}}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Age</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isPatientsLoading ? (
                                <TableRowsSkeleton rows={5} columns={2} animate={true}/>
                            ) : isPatientsError ? (
                                <TableRow>
                                    <TableCell colSpan={2}
                                               align="center">{"Trouble connecting. Please ensure internet connection"}
                                    </TableCell>
                                </TableRow>
                            ) : patients.length === 0 ? (
                                <TableRow style={{pointerEvents: 'none'}}>
                                    <TableCell colSpan={2} style={{ height: `calc(${36 * 7}px - 52px)` }}>
                                        <Box display={"flex"} justifyContent={"center"} alignItems={"center"} height={"100%"}>
                                            <Typography variant={"h3"} fontStyle={'oblique'} textAlign={"center"}>Add a patient to get started</Typography>
                                        </Box>
                                    </TableCell>
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
                                            <TableCell>{patient.age}</TableCell>
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
                </TableContainer>
            </Grid>

            <Grid item container xs={12} sm={8} spacing={2} style={{flexGrow: 1}}>
                <Grid item xs={12} style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                    <Stack direction={"row"} display={"flex"} justifyContent={"space-between"}>
                        <Box display={"flex"}>
                            <NewLsaForm selectedPatient={selectedPatient} onLsaAdd={(newLsa: Lsa) => {
                                setSelectedLsa(newLsa);
                                handleLsaRowClick(newLsa);
                            }}/>
                            <Typography variant="h3" sx={{mb: 1, ml: 1}}>
                                Student LSA&apos;s
                            </Typography>
                        </Box>

                        {selectedLsa &&
                            <IconButton onClick={(e: React.MouseEvent) => { // Conditionally show button when LSA is selected
                                e.stopPropagation();
                                setOpenDeleteDialog(true);
                            }}>
                                <Dialog
                                    open={openDeleteDialog}
                                    onClose={handleCloseDeleteDialog}
                                >
                                    <Stack alignItems={"center"}>

                                        <DialogTitle>Delete LSA</DialogTitle>
                                        <DialogContent>
                                            <Typography variant="body1">
                                                Are you sure you want to delete <b>{selectedLsa.name}</b>?
                                            </Typography>
                                            <Typography textAlign={"center"}>
                                                <u><b>It cannot be
                                                    recovered</b></u>
                                            </Typography>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button disabled={isDeletingLsa}
                                                    onClick={handleCloseDeleteDialog}>Cancel</Button>
                                            <Button disabled={isDeletingLsa} onClick={handleDeleteLsa}
                                                    color="error">Delete</Button>
                                        </DialogActions>
                                    </Stack>

                                </Dialog>

                                <DeleteIcon color={"error"}/>
                            </IconButton>}
                    </Stack>
                    <TableContainer component={Paper} sx={{mb: 2}}
                                    style={{maxHeight: `${36 * 7}px`, minHeight: `${36 * 7}px`, overflow: 'auto'}}>
                        <Table stickyHeader>
                            <TableHead>

                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>MLU-M</TableCell>
                                    <TableCell>TNW</TableCell>
                                    <TableCell>WPS</TableCell>
                                    <TableCell>CPS</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>

                                {!selectedPatient || isPatientsError ? (
                                    <TableRowsSkeleton rows={5} columns={6} animate={false}/>
                                ) : (
                                    <>
                                        {lsas
                                            ?.filter((lsa: Lsa) => lsa.patient_id === selectedPatient.patient_id)
                                            .map((lsa: Lsa, i: number) => {
                                                const date = new Date(lsa.created_at * 1000);
                                                const formattedDate = date.toLocaleDateString();
                                                const formattedTime = date.toLocaleTimeString('en-us', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: true
                                                });
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
                                                        <TableCell
                                                            sx={{width: '30%'}}>{`${formattedDate} ${formattedTime}`}</TableCell>
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
                                                const numLsas = lsas?.filter((lsa: Lsa) => lsa.patient_id === selectedPatient.patient_id).length;
                                                const emptyRowsToRender = Math.max(0, 5 - numLsas);
                                                return Array.from({length: emptyRowsToRender}, (_, index) => (
                                                    <TableRow key={`empty-${index}`} style={{height: 36}}>
                                                        <TableCell colSpan={6}/>
                                                    </TableRow>
                                                ));
                                            })()
                                        }
                                    </>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <ButtonPulsing
                    disabled={!selectedLsa || (selectedLsa.lsa_id === selectedLsaId)} // Disable button after click or if no LSA is selected
                    shouldPulse={!!selectedLsa && (selectedLsa.lsa_id !== selectedLsaId)} // Pulse only if an LSA is selected and button hasn't been clicked
                    onClick={handleChosenLsa}
                    variant={"contained"}
                >
                    Proceed With: {selectedLsa?.name}
                </ButtonPulsing>
            </Grid>
        </Grid>
    );
}