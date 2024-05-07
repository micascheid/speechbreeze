import {useSelectedLSA} from "@/contexts/SelectedLSAContext";
import useSWR, {mutate} from "swr";
import axios, {fetcher} from "@/utils/axios";
import {Utterance} from "@/data/Utterance";
import {openSnackbar} from "@/api/snackbar";
import {SnackbarProps} from "@/types/snackbar";

export default function useUtterances() {
    const { selectedLsaId } = useSelectedLSA();
    const { data, isLoading, error } = useSWR(!!selectedLsaId ? `${process.env.NEXT_API_BASE_URL}/lsas/${selectedLsaId}/utterances/get`: null, fetcher);

    const handleBatchUpdate = async (utterances: Utterance[]) => {
        try {
            await axios.put(`${process.env.NEXT_API_BASE_URL}/lsas/${selectedLsaId}/utterances/batch-update`, {utterances: utterances});
            openSnackbar({
                open: true,
                message: "Successfully saved utterances",
                variant: "alert",
                alert: {
                    color: "success",
                    variant: "filled"
                },
            } as SnackbarProps);

        } catch (error) {
            openSnackbar({
                open: true,
                message: "Failed to create new utterance",
                variant: "alert",
                alert: {
                    color: "error",
                    variant: "filled"
                },
            } as SnackbarProps);
        }
    };

    return {
        utterances: data?.utterances,
        isLoading,
        isError: error,
        handleBatchUpdate,
        mutate: mutate
    };
}