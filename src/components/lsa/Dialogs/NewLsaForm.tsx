import {Patient, PatientNew} from "@/data/Patients";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, FormControl, FormControlLabel,
    IconButton, Radio, RadioGroup, Select,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import React, {useState} from "react";
import {bool} from "yup";
import {Lsa} from "@/data/Lsa";
import axios, { AxiosError } from "axios";
import useLsas from "@/hooks/lsa/useLsas";
import useUser from "@/hooks/useUser";
import {useSelectedLSA} from "@/contexts/SelectedLSAContext";
import AddBoxIcon from "@mui/icons-material/AddBox";
import {event} from "next/dist/build/output/log";


type NewLsaFormProps = {
    selectedPatient: Patient | null;
    selectedLsa: Lsa | null;
}

export default function NewLsaForm({selectedPatient, selectedLsa}: NewLsaFormProps) {
    const [open, setOpen] = useState<boolean>(false);
    const [name, setName] = useState('');
    const [nameError, setNameError] = useState('');
    const [savingLsa, setSavingLsa] = useState(false);
    const [newLsaData, setNewLsaData] = useState<{ name: string, audio_type: string | null }>({ name: '', audio_type: null });
    const [lsaSaveError, setLsaSaveError] = useState<string | null>(null);
    const {lsas, isLoading: isLsasLoading, isError: isLsasError, mutateLsas} = useLsas();
    const {uid: slp_id} = useUser() || {};

    const { selectedLsaId, setSelectedLsaId } = useSelectedLSA();
    const [audioSelection, setAudioSelection] = useState<"record" | "upload" | "noaudio" | null>(null);
    const handleClose = () => {
        setOpen(false);
        setName('');
        setSavingLsa(false);
        setAudioSelection(null);
        setNewLsaData({ name: '', audio_type: null});
        setLsaSaveError(null);
    }


    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);

        if (!validateName(event.target.value)) {
            if (event.target.value.length > 255) {
                setNameError('Input is not valid. Maximum length is 255 characters.')
            } else {
                setNameError('Input is not valid. Only numbers, characters, _, - and spaces are allowed.')
            }
        } else {
            setNameError('');
            setNewLsaData(prevState => {
                return { ...prevState, name: event.target.value };
            });
        }
    }

    const validateName = (name: string): boolean => {
        // Regex explanation: start^ with a-z A-Z 0-9 _ - characters
        const validName = /^[a-zA-Z0-9-_ ]{1,255}$/;
        return validName.test(name);
    }


    const saveNewLsa = async () => {
        console.log("clicked");
        // const validationError = validateName(newLsaData.name);
        // if (validationError) {
        //     setLsaSaveError('');
        //     setSavingLsa(false);
        //     return; // Prevent further execution
        // }

        setSavingLsa(true);
        try {
            await axios.post('http://127.0.0.1:5000/create-lsa', {...newLsaData, patient_id: selectedPatient?.patient_id, slp_id: slp_id});
            await mutateLsas(`/lsas?uid=${slp_id}`);
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
                        value={name}
                        onChange={handleNameChange}
                        error={!!nameError}
                        helperText={nameError}
                        sx={{mb: 2}}
                    />
                    <Typography variant={"subtitle1"}>Please select the audio you&apos;ll be using.</Typography>

                    <FormControl component="fieldset">
                        <RadioGroup
                            aria-label="audio selection"
                            defaultValue=""
                            name="radio-buttons-group"
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                const value = event.target.value;
                                if (["record", "upload", "noaudio"].includes(value)) {
                                    setAudioSelection(value as "record" | "upload" | "noaudio");
                                    setNewLsaData(prevState => {
                                        return { ...prevState, audio_type: value };
                                    })
                                }
                            }}
                        >
                            <FormControlLabel value="record" control={<Radio />} label="Record" />
                            <FormControlLabel value="upload" control={<Radio />} label="Upload Audio" />
                            <FormControlLabel value="noaudio" control={<Radio />} label="No Audio" />
                        </RadioGroup>
                    </FormControl>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={saveNewLsa}
                        color="primary"
                        disabled={((!!nameError || !name) || !audioSelection) || savingLsa}
                    >
                        {savingLsa ? 'Saving...' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>

    );
};