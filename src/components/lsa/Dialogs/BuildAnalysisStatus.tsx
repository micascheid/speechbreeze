import {
    Box,
    Button,
    ButtonGroup,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
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
import {sentence_status, Utterance} from "@/data/Utterance";

type BuildAnalysisStatusProps = {
    resultsStatus: 'crunching' | 'success' | 'error' | 'assistMlu' | 'assistWpsCps' | null;
    setResultsStatus: (status: 'crunching' | 'success' | 'error' | 'assistMlu' | 'assistWpsCps' | null) => void;
    morphZeroData: UtteranceDataType | null;
    utterancesReviewData: UtterancesObject | null;
    setUtterancesReviewData: (utterancesObject: UtterancesObject) => void
}

type UtterancesObject = {
    [key: string]: Utterance;
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

export default function BuildAnalysisStatus({
                                                resultsStatus,
                                                setResultsStatus,
                                                morphZeroData,
                                                utterancesReviewData,
                                                setUtterancesReviewData
                                            }: BuildAnalysisStatusProps) {
    const {selectedLsaId} = useSelectedLSA();
    const [wordData, setWordData] = useState<UtteranceDataType | null>(morphZeroData);
    const [saveMorphZero, setSaveMorphZero] = useState<boolean>(false);
    const [utterancesWpsCps, setUtterancesWpsCps] = useState<Record<number, {clause_count: number, sentence: sentence_status}>>({})
    const [isSavingWpsCps, setIsSavingWpsCps] = useState<boolean>(false);
    const {lsa, isLoading, isError, mutateLsa} = useLsa();
    const {user} = useUser();
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

    const assistMluUI = () => {
        return (
            <Box>
                {wordData && Object.entries(wordData).map(([utteranceId, words]) =>
                    Object.entries(words as Record<string, WordData>).map(([wordId, {word, morph_count}]) => (
                        <Grid container key={`${utteranceId}-${wordId}`} alignItems="center">
                            <Grid item xs style={{wordWrap: 'break-word', paddingRight: '5px'}}>
                                <Typography>{word}</Typography>
                            </Grid>
                            <Grid item>
                                <TextField
                                    id={`${utteranceId}-${wordId}`}
                                    type="number"
                                    value={morph_count}
                                    inputProps={{min: "0"}}
                                    onChange={(e) => handleChange(utteranceId, wordId, Number(e.target.value))}
                                    style={{marginLeft: '2px', width: 60}}
                                />
                            </Grid>
                        </Grid>
                    ))
                )}
                <LoadingButton
                    loading={saveMorphZero}
                    loadingPosition="start"
                    startIcon={<SaveIcon/>}
                    variant="outlined"
                    onClick={handleSaveMorphZeroWords}
                    sx={{mt: 1}}
                >
                    Save
                </LoadingButton>
            </Box>
        )
    }

    const updateClauseCount = (utteranceId: number, count: number) => {
        setUtterancesWpsCps(prev => ({
            ...prev,
            [utteranceId]: { ...prev[utteranceId], clause_count: count },
        }));
    }

    const updateSentenceStatus = (utteranceId: number, status: sentence_status) => {
        setUtterancesWpsCps(prev => ({
            ...prev,
            [utteranceId]: { ...prev[utteranceId], sentence: status },
        }));
    }

    const assistWpsCpsUI = () => {
        return (
            <Box>
                {utterancesReviewData && Object.entries(utterancesReviewData).map(([utteranceId, utterance]) => {
                    const id = Number(utteranceId)
                    return (
                        <Box display="flex" alignItems={"center"} justifyContent="space-between" marginBottom="10px" key={utteranceId} sx={{flexWrap: "nowrap"}}>
                            <Typography style={{flexGrow: 1, flexBasis: 0, overflow: "hidden"}} mr={2} sx={{textAlign: "left"}}>
                                {utterance.utterance_text}
                            </Typography>

                            <ButtonGroup variant="outlined" aria-label="outlined number button group">
                                {[0, 1, 2, 3, 4, 5].map((number) => (
                                    <Button
                                        key={number}
                                        onClick={() => {
                                            updateClauseCount(id, number);
                                            setUtterancesWpsCps(prev => {
                                                const prevItem = prev[id] || {};
                                                return {
                                                    ...prev,
                                                    [utteranceId]: {
                                                        ...prevItem,
                                                        clause_count: number,
                                                        sentence: number === 0 ? sentence_status.False : sentence_status.True
                                                    },
                                                };
                                            });
                                        }}
                                        variant={utterancesWpsCps[id]?.clause_count === number ? 'contained' : 'outlined'}
                                    >
                                        {number}
                                    </Button>
                                ))}
                            </ButtonGroup>
                        </Box>
                    )
                })}
                <Box alignSelf={"flex-start"}>
                    <Button variant={"outlined"} onClick={handleSaveWpsCps}
                            disabled={(utterancesReviewData ? Object.entries(utterancesReviewData).some(([utteranceId]) =>
                                typeof utterancesWpsCps[Number(utteranceId)]?.clause_count === "undefined"
                            ): true) || isSavingWpsCps}
                    >
                        {isSavingWpsCps ? "Saving..." : "Save"}
                    </Button>
                </Box>
            </Box>
        );
    }

    const handleSaveMorphZeroWords = async () => {
        setSaveMorphZero(true);
        try {
            console.log(wordData);
            await axios.post(`http://127.0.0.1:5000/lsas/${selectedLsaId}/morph-zero-update`, {'utterances': wordData});

            await mutateLsa(`/lsa?lsaId=${selectedLsaId}`);
            await mutateLsas(`/lsas?uid=${user?.uid}`);
            openSnackbar({
                open: true,
                message: "MlU calculation completed",
                variant: "alert",
                alert: {
                    color: "success",
                    variant: "filled"
                }
            } as SnackbarProps)
            const wpsCpsResponse = await axios.post(`http://127.0.0.1:5000/lsas/${selectedLsaId}/crunch-results-wps-cps`);
            console.log("REVIEW:", wpsCpsResponse.data.utterances_for_review);
            setResultsStatus('assistWpsCps');
            setUtterancesReviewData(wpsCpsResponse.data.utterances_for_review);
        } catch (e) {
            console.error(e);
            console.log("ERROR");
            setResultsStatus('error');
        } finally {
            // setResultsStatus(null);
            // setSaveMorphZero(false);
        }
    }

    const handleSaveWpsCps = async () => {
        setSaveMorphZero(true);
        setIsSavingWpsCps(true);
        try {
            console.log(wordData);
            await axios.post(`http://127.0.0.1:5000/lsas/${selectedLsaId}/utterances-wps-cps-save`, {'utterances': utterancesWpsCps});
            await mutateLsa(`/lsa?lsaId=${selectedLsaId}`);
            await mutateLsas(`/lsas?uid=${user?.uid}`);
            openSnackbar({
                open: true,
                message: "WPS and CPS completed",
                variant: "alert",
                alert: {
                    color: "success",
                    variant: "filled"
                }
            } as SnackbarProps)
            setResultsStatus(null);
        } catch (e) {
            console.error(e);
            console.log("ERROR");
            setResultsStatus('error');
            setSaveMorphZero(false)
        } finally {
            // setResultsStatus(null);
            // setSaveMorphZero(false);
            setIsSavingWpsCps(false);
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
                    {resultsStatus === 'assistMlu' && assistMluUI()}
                    {resultsStatus === 'assistWpsCps' && assistWpsCpsUI()}
                </Box>
            </DialogContent>
        </Dialog>
    )
}