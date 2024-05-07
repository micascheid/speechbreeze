import {Patient, PatientNew} from "@/data/Patients";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, FormControl, FormControlLabel, FormLabel,
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
import {update} from "lodash-es";


type NewLsaFormProps = {
    selectedPatient: Patient | null;
    onLsaAdd: (selectedLsa: Lsa) => void;
}

export default function NewLsaForm({selectedPatient, onLsaAdd}: NewLsaFormProps) {
    const [open, setOpen] = useState<boolean>(false);
    const [name, setName] = useState('');
    const [nameError, setNameError] = useState('');
    const [savingLsa, setSavingLsa] = useState(false);
    const [newLsaData, setNewLsaData] = useState<{ name: string, audio_type: string | null }>({ name: '', audio_type: null });
    const [lsaSaveError, setLsaSaveError] = useState<string | null>(null);
    const {lsas, isLoading: isLsasLoading, isError: isLsasError, mutateLsas} = useLsas();
    const [isTranscriptionAutomated, setIsTranscriptionAutomated] = useState<boolean | null>(null);
    const {uid: slp_id} = useUser()?.user || {};

    const { selectedLsaId, setSelectedLsaId } = useSelectedLSA();
    const [audioSelection, setAudioSelection] = useState<"record" | "upload" | "noaudio" | null>(null);
    const handleClose = () => {
        setOpen(false);
        setName('');
        setSavingLsa(false);
        setAudioSelection(null);
        setNewLsaData({ name: '', audio_type: null});
        setLsaSaveError(null);
        setIsTranscriptionAutomated(null);
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
        setSavingLsa(true);
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/lsa/create-lsa`, {...newLsaData, patient_id: selectedPatient?.patient_id, slp_id: slp_id});
            const updatedLsas = await mutateLsas(`/lsas/${slp_id}`);
            if (updatedLsas && updatedLsas.length > 0)
            {
                const newLsa = updatedLsas.find((lsa: Lsa) => lsa.lsa_id === response.data.lsa_id);
                onLsaAdd(newLsa);
                handleClose();
            }
        } catch (error: any) {
            console.error(error);
            setSavingLsa(false);
            let errorMsg = 'Error saving LSA. Please, try again.';
            if (error.response) {
                // The request was made and server responded with a status outside of the 2xx range
                errorMsg = error.message || 'Error saving LSA. Please, try again.';
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
                    <Stack spacing={2}>
                        <FormControl component="fieldset">
                            <FormLabel component={"legend"}><Typography variant={"subtitle1"} color={"#000"}>Please select the audio you&apos;ll be using.</Typography></FormLabel>
                            <RadioGroup
                                aria-label="audio selection"
                                defaultValue=""
                                name="radio-buttons-group"
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    const value = event.target.value;
                                    if (["record", "upload", "noaudio"].includes(value)) {
                                        setAudioSelection(value as "record" | "upload" | "noaudio");
                                        if (value === "noaudio") {
                                            setIsTranscriptionAutomated(false);
                                        }
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
                        <FormControl component="fieldset" disabled={audioSelection === "noaudio"}>
                            <FormLabel component={"legend"}><Typography variant={"subtitle1"} color={"#000"}>Transcription Type</Typography></FormLabel>
                            <RadioGroup
                                aria-label="transcription type"
                                name="transcription-type"
                                value={isTranscriptionAutomated === null ? '' : isTranscriptionAutomated ? 'auto' : 'manual'}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    const isAutomated = event.target.value === "auto";
                                    setIsTranscriptionAutomated(isAutomated);
                                    setNewLsaData(prevState => {
                                        return { ...prevState, transcription_automated: isAutomated };
                                    });
                                }}
                                // disabled={audioSelection === "noaudio"} // disable if "No Audio" is selected
                            >
                                <FormControlLabel value="auto" control={<Radio />} label="Automated" />
                                <FormControlLabel value="manual" control={<Radio />} label="Manual" />
                            </RadioGroup>
                        </FormControl>
                    </Stack>

                    <Typography color="error">{lsaSaveError}</Typography>
                </DialogContent>

                <DialogActions>

                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={saveNewLsa}
                        color="primary"
                        disabled={
                            savingLsa || !name || !!nameError || !audioSelection || (audioSelection !== "noaudio" && isTranscriptionAutomated === null)
                        }
                    >
                        {savingLsa ? 'Creating...' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>

    );
};