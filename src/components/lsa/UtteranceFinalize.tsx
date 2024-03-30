import {Box, Button} from "@mui/material";
import {Patient} from "@/data/Patients";
import {Utterance} from "@/data/Utterance";
import useSWR from "swr";
import axios, {fetcher} from "@/utils/axios";
import useUtterances from "@/hooks/lsa/useUtterances";
import {useSelectedLSA} from "@/contexts/SelectedLSAContext";
import {openSnackbar} from "@/api/snackbar";
import {SnackbarProps} from "@/types/snackbar";


type UtterancesFinalizeProps = {
    utterances: Utterance[];
}

export default function UtteranceFinalize({utterances}: UtterancesFinalizeProps) {
    const { selectedLsaId } = useSelectedLSA();
    const { handleBatchUpdate } = useUtterances();
    const handleSubmitUtterances = async () => {
        try {
            let orderedUtterances;
            const sortedUtterances = [...utterances].sort((a, b) => a.start - b.start || a.end - b.end);
            orderedUtterances = sortedUtterances.map((utterance, index) => {
                return {...utterance, utterance_order: index};
            });
            await handleBatchUpdate(orderedUtterances);
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


    return (
        <Box>
            <Button onClick={handleSubmitUtterances}>Save Utterances</Button>
        </Box>
    )
}