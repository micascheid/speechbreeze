import {Box, Button, Stack, TextField, Typography} from "@mui/material";
import useLsa from "@/hooks/lsa/useLsa";
import {useEffect, useState} from "react";
import axios from "axios";
import SavingDialog from "@/components/lsa/Dialogs/SavingsDialog";
import {openSnackbar} from "@/api/snackbar";
import {SnackbarProps} from "@/types/snackbar";
import TranscriptionFinalize from "@/components/lsa/Dialogs/TranscriptionFinalizeDialog";


export default function TranscriptionEdit() {
    const {lsa, isLoading, isError, mutateLsa, handleUpdate} = useLsa();
    const [textfieldValue, setTextfieldValue] = useState(lsa?.transcription || '');
    const [isSaving, setIsSaving] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState<boolean>(false);


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

    const handleOpenConfirm = () => {
        setIsConfirmed(false);
    }

    const handleCloseConfirm = () => {
        setIsConfirmed(false);
    }

    const handleFinalizationConfirm = async () => {
        handleCloseConfirm();
        handleFinalization();
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
                <Button onClick={handleSave} variant="outlined" disabled={!textfieldValue} style={{marginTop: '1em'}}>Save Transcription</Button>
                <TranscriptionFinalize setFinalize={handleFinalizationConfirm} disabled={isSaving || !lsa?.transcription} />
            </Stack>
            <SavingDialog open={isSaving}/>
        </Box>
    );
}