import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle, Grid,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import React, {useEffect, useState} from "react";
import ContactUsBox from "@/components/ContactUsBox";
import axios from "@/utils/axios";
import {useSelectedLSA} from "@/contexts/SelectedLSAContext";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import useLsa from "@/hooks/lsa/useLsa";
import useLsas from "@/hooks/lsa/useLsas";
import useUser from "@/hooks/useUser";
import {openSnackbar} from "@/api/snackbar";
import {SnackbarProps} from "@/types/snackbar";

type BuildAnalysisStatusProps = {
    resultsStatus: 'crunching' | 'success' | 'error' | 'assist' | null;
    setResultsStatus: (status: 'crunching' | 'success' | 'error' | null) => void;
    morphZeroData: UtteranceDataType | null;
}


type UtteranceDataType = {
    [utterance_id: string]: {
        [word_id: string]: {
            word: string;
            morph_count: number;
        };
    };
};

type WordData = {
    word: string;
    morph_count: number;
};

export default function BuildAnalysisStatus({resultsStatus,  setResultsStatus, morphZeroData}: BuildAnalysisStatusProps) {
    const { selectedLsaId } = useSelectedLSA();
    const [wordData, setWordData] = useState<UtteranceDataType | null>(morphZeroData);
    const [saveMorphZero, setSaveMorphZero] = useState<boolean>(false);
    const {lsa, isLoading, isError, mutateLsa } = useLsa();
    const user = useUser();
    const {mutateLsas} = useLsas();
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

    const handleChange = (utteranceId: string, wordId: string, count: number) => {
        setWordData(oldData => {
            if (oldData === null) {
                return oldData;
            }

            return {
                ...oldData,
                [utteranceId]: {
                    ...oldData[utteranceId],
                    [wordId]: {
                        ...oldData[utteranceId][wordId],
                        morph_count: count,
                    },
                },
            };
        });
    };

    const assistUI = () => {
        return (
            <>
                {wordData && Object.entries(wordData).map(([utteranceId, words]) =>
                    Object.entries(words as Record<string, WordData>).map(([wordId, { word, morph_count }]) => (
                        <Grid container key={`${utteranceId}-${wordId}`} alignItems="center">
                            <Grid item xs style={{ wordWrap: 'break-word', paddingRight: '5px' }}>
                                <Typography>{word}</Typography>
                            </Grid>
                            <Grid item>
                                <TextField
                                    id={`${utteranceId}-${wordId}`}
                                    type="number"
                                    value={morph_count}
                                    inputProps={{ min: "0" }}
                                    onChange={(e) => handleChange(utteranceId, wordId, Number(e.target.value))}
                                    style={{ marginLeft: '2px', width: 60}}
                                />
                            </Grid>
                        </Grid>
                    ))
                )}
                <LoadingButton
                    loading={saveMorphZero}
                    loadingPosition="start"
                    startIcon={<SaveIcon />}
                    variant="outlined"
                    onClick={handleSaveMorphZeroWords}
                >
                    Save
                </LoadingButton>
            </>
        )
    }

    const handleSaveMorphZeroWords = async () => {
        setSaveMorphZero(true);
        try {
            console.log(wordData);
            await axios.post(`http://127.0.0.1:5000/lsas/${selectedLsaId}/morph-zero-update`, {'utterances': wordData});
            await  mutateLsa(`/lsa?lsaId=${selectedLsaId}`);
            await mutateLsas(`/lsas?uid=${user?.uid}`);
            openSnackbar({
                open: true,
                message: "Analysis completed",
                variant: "alert",
                alert: {
                    color: "success",
                    variant: "filled"
                }
            } as SnackbarProps)
        } catch (e) {

            console.error(e);
        } finally {
            setResultsStatus(null);
            setSaveMorphZero(false);
        }
    }

    useEffect(() => {
        if (morphZeroData !== null) {
            setWordData(morphZeroData);
        }
    }, [morphZeroData]);


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
                    {resultsStatus === 'assist' && assistUI()}
                </Box>
            </DialogContent>
        </Dialog>
    )
}