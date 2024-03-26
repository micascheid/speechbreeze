import {useSelectedLSA} from "@/contexts/SelectedLSAContext";
import useSWR, {mutate} from "swr";
import {fetcher} from "@/utils/axios";


export default function useTranscription() {
    const { selectedLsaId } = useSelectedLSA();
    const { data, isLoading, error } = useSWR(!!selectedLsaId ? `/get-transcription?lsaId=${selectedLsaId}` : null, fetcher);
    console.log("TRANSCRIPTION: ", data);
    return {
        transcription: data?.transcription,
        isLoading,
        isError: error,
        mutateTranscription: mutate
    }
}