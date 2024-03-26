import {Box, Button, Stack, TextField, Typography} from "@mui/material";
import useLsa from "@/hooks/lsa/useLsa";
import {useEffect, useState} from "react";
import axios from "axios";
import SavingDialog from "@/components/lsa/Dialogs/SavingsDialog";
import {openSnackbar} from "@/api/snackbar";
import {SnackbarProps} from "@/types/snackbar";


export default function TranscriptionEdit() {
    const {lsa, isLoading, isError, mutateLsa, handleUpdate} = useLsa();
    const [textfieldValue, setTextfieldValue] = useState(lsa?.transcription || '');
    const [isSaving, setIsSaving] = useState(false);


    useEffect(() => {
        setTextfieldValue(lsa?.transcription || '');
    }, [lsa]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await handleUpdate({transcription: textfieldValue});
        } catch (error) {
            console.log("Unable to save transcription value");
        } finally {
            setIsSaving(false);
        }
    };

    const handleFinalization = async () => {
        setIsSaving(true);
        try {
            await handleUpdate({transcription_final: true});
        } catch (error) {
            console.log("Unable to save transcription value");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Box>
            <TextField
                value={textfieldValue}
                onChange={e => setTextfieldValue(e.target.value)}
                fullWidth
                multiline
                minRows={5}
            />
            <Stack direction={"row"} spacing={1}>
                <Button onClick={handleSave} variant="outlined" style={{marginTop: '1em'}}>Save Transcription</Button>
                <Button onClick={handleFinalization} variant="outlined" style={{marginTop: '1em'}}>Finalize Transcription</Button>
            </Stack>
            <SavingDialog open={isSaving}/>
        </Box>
    );
}