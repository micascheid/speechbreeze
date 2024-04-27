import {Box, Button, CircularProgress, Stack} from "@mui/material";
import {Patient} from "@/data/Patients";
import {Utterance} from "@/data/Utterance";
import useSWR from "swr";
import SaveIcon from '@mui/icons-material/Save';
import axios, {fetcher} from "@/utils/axios";
import useUtterances from "@/hooks/lsa/useUtterances";
import {useSelectedLSA} from "@/contexts/SelectedLSAContext";
import {openSnackbar} from "@/api/snackbar";
import {SnackbarProps} from "@/types/snackbar";
import useLsa from "@/hooks/lsa/useLsa";
import BuildAnalysisStatus from "@/components/lsa/Dialogs/BuildAnalysisStatus";
import React, {useState} from "react";
import LoadingButton from "@mui/lab/LoadingButton";


type UtterancesFinalizeProps = {
    utterances: Utterance[];
}

type UtteranceDataType = {
    [utterance_id: string]: {
        [word_id: string]: {
            word: string;
            morph_count: number;
        };
    };
};

type UtterancesObject = {
    [key: string]: Utterance;
}

export default function UtteranceFinalize({utterances}: UtterancesFinalizeProps) {
    const [resultsStatus, setResultsStatus] = useState<'crunching' | 'success' | 'error' | 'assistMlu' | 'assistWpsCps' | null>(null);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [morphZeroData, setMorphZeroData] = useState<UtteranceDataType | null>(null);
    const [utterancesReviewData, setUtterancesReviewData] = useState<UtterancesObject | null>(null);
    const { handleBatchUpdate } = useUtterances();
    const { selectedLsaId } = useSelectedLSA();

    const {lsa, isLoading, isError, mutateLsa } = useLsa();

    const handleSubmitUtterances = async () => {
        setIsSaving(true);
        try {
            let orderedUtterances;
            const sortedUtterances = [...utterances].sort((a, b) => a.start_text - b.start_text || a.end_text - b.end_text);
            orderedUtterances = sortedUtterances.map((utterance, index) => {
                return {...utterance, utterance_order: index};
            });

            await handleBatchUpdate(orderedUtterances);
            setIsSaving(false)
        } catch (error) {
            openSnackbar({
                open: true,
                message: "Failed to save utterances",
                variant: "alert",
                alert: {
                    color: "error",
                    variant: "filled"
                },
            } as SnackbarProps);
        }
    }

    const handleBuildResults = async () => {
        setResultsStatus('crunching');
        try {
            await handleSubmitUtterances();
            const response = await axios.post(`http://127.0.0.1:5000/lsas/${selectedLsaId}/crunch-results-mlu-tnw`);
            await  mutateLsa(`/lsa/${selectedLsaId}`);
            console.log(response);
            if (Object.keys(response.data?.morph_zero).length === 0) {
                openSnackbar({
                    open: true,
                    message: "Successfully received analysis",
                    variant: "alert",
                    alert: {
                        color: "success",
                        variant: "filled"
                    },
                } as SnackbarProps);
                const wpsCpsResponse = await axios.post(`http://127.0.0.1:5000/lsas/${selectedLsaId}/crunch-results-wps-cps`);
                console.log("REVIEW:", wpsCpsResponse.data.utterances_for_review);
                setResultsStatus('assistWpsCps');
                setUtterancesReviewData(wpsCpsResponse.data.utterances_for_review);
            } else {
                setMorphZeroData(response.data.morph_zero);
                setResultsStatus('assistMlu');
            }
        } catch (error) {
            console.error("Error while generating results :", error);
            setResultsStatus('error');
        }

    }


    return (
        <>
            <Stack direction={"row"} spacing={1}>
                <LoadingButton
                    loading={isSaving}
                    loadingPosition="start"
                    startIcon={<SaveIcon />}
                    variant="outlined"
                    onClick={handleSubmitUtterances}
                >
                    Save
                </LoadingButton>
                <Button variant={"outlined"} onClick={handleBuildResults} disabled={!utterances || utterances.length === 0}>Get Analysis!</Button>
            </Stack>
            {resultsStatus &&
                <BuildAnalysisStatus
                    resultsStatus={resultsStatus}
                    setResultsStatus={setResultsStatus}
                    morphZeroData={morphZeroData}
                    utterancesReviewData={utterancesReviewData}
                    setUtterancesReviewData={setUtterancesReviewData}
                />
            }

        </>

    )
}