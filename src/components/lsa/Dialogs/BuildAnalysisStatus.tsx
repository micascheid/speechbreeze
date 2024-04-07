import {Box, Button, CircularProgress, Dialog, DialogContent, DialogTitle, Stack, Typography} from "@mui/material";
import React, {useState} from "react";
import ContactUsBox from "@/components/ContactUsBox";

type BuildAnalysisStatusProps = {
    resultsStatus: 'crunching' | 'success' | 'error' | null;
    setResultsStatus: (status: 'crunching' | 'success' | 'error' | null) => void;
}

export default function BuildAnalysisStatus({resultsStatus,  setResultsStatus}: BuildAnalysisStatusProps) {
    console.log("rendering buildanalysis");
    const crunchingUI = () => {
        return (
            <>
                <CircularProgress/>
                <Typography>Crunching...</Typography>
            </>
        );
    };


    const errorUI = () => {
        return (
            <Stack justifyContent={"center"}>
                <Typography>Our apologies: The following has occurred:</Typography>
                <Typography color={"error"}></Typography>
                <ContactUsBox/>
                <Button variant={"outlined"} onClick={() => setResultsStatus(null)}>Close</Button>
            </Stack>
        )
    }

    const handleClose = (reason: any) => {
        if (reason.type === 'click') {
            return;
        }
        setResultsStatus(null);
    }

    return (
        <Dialog
            open={resultsStatus !== null}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            disableEscapeKeyDown
        >
            <DialogTitle id="alert-dialog-title">Grabbing Results</DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                    {resultsStatus === 'crunching' && crunchingUI()}
                    {resultsStatus === 'error' && errorUI()}
                </Box>
            </DialogContent>
        </Dialog>
    )
}