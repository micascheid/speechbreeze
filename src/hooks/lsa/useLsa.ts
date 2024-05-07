import useSWR, {mutate} from "swr";
import axios, {fetcher} from "@/utils/axios";
import {useSelectedLSA} from "@/contexts/SelectedLSAContext";
import {useEffect} from "react";
import {Lsa} from "@/data/Lsa";
import {SnackbarProps} from "@/types/snackbar";
import {openSnackbar} from "@/api/snackbar";

export default function useLsa() {
    const { selectedLsaId } = useSelectedLSA();
    const { data, isLoading, error } = useSWR(!!selectedLsaId ? `/lsa/${selectedLsaId}` : null, fetcher);

    useEffect(() => {
        async function fetchLsa() {
            await mutate(`/lsa/${selectedLsaId}`);
        }
        fetchLsa();
    }, [selectedLsaId]);

    const handleUpdate = async (lsaData: Partial<Lsa>) => {
        try {
            await axios.patch(`${process.env.NEXT_API_BASE_URL}/update-transcription/${selectedLsaId}`, lsaData);
            await mutate(`/lsa/${selectedLsaId}`);
            // You can use mutateLsa here instead of mutate directly if this is the api endpoint you want to reload, but make sure it is properly exposed in your useLsa hook and its return structure.
        } catch (error) {
            openSnackbar({
                open: true,
                message: "Failed to save transcription",
                variant: "alert",
                alert: {
                    color: "success",
                    variant: "filled"
                },
            } as SnackbarProps);
        } finally {
            // setIsSaving(false);
        }
    };

    return {
        lsa: data,
        isLoading,
        isError: error,
        mutateLsa: mutate,
        handleUpdate,
    }
}