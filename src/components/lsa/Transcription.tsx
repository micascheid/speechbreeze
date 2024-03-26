import {Box, Button, CircularProgress, Grid, Skeleton, Stack, Typography} from "@mui/material";
import useLsa from "@/hooks/lsa/useLsa";
import useTranscription from "@/hooks/lsa/useTranscription";
import ContactUsBox from "@/components/ContactUsBox";
import React from "react";
import {useSelectedLSA} from "@/contexts/SelectedLSAContext";
import TranscriptionEdit from "@/components/lsa/TranscriptionEdit";

export default function Transcription() {
    const {lsa, isLoading, isError, mutateLsa} = useLsa();
    const {selectedLsaId} = useSelectedLSA();

    return (
        <Grid item>
            {!selectedLsaId ? (
                <Grid item xs={12}>
                    <Skeleton variant={'rounded'} animation={false} height={200}/>
                </Grid>
            ) : isLoading ? (
                <Grid item xs={12}>
                    <Box height={200}>
                        <CircularProgress/>
                    </Box>
                </Grid>
            ) : isError ? (
                <Grid item xs={12}>
                    <Typography variant={"subtitle1"}>We are having troubles loading this LSA at this time. Try
                        reloading, or feel free to reach out.</Typography>
                    <ContactUsBox/>
                </Grid>
            ) : lsa?.transcription_final ? (
                <Typography>{lsa.transcription}</Typography>
            ) : (
                <Grid item xs={12}>
                    <TranscriptionEdit />
                </Grid>
            )}
        </Grid>
    );
}

