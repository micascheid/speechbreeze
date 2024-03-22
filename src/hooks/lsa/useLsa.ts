import useUser from "@/hooks/useUser";
import useSWR, {mutate} from "swr";
import {fetcher} from "@/utils/axios";
import { Patient} from "@/data/Patients";
import {useSelectedLSA} from "@/contexts/SelectedLSAContext";
import {useEffect} from "react";

export default function useLsa() {
    const { selectedLsaId } = useSelectedLSA();
    const { data, isLoading, error } = useSWR(!!selectedLsaId ? `/lsa?lsaId=${selectedLsaId}` : null, fetcher);

    useEffect(() => {
        mutate(`/lsa?lsaId=${selectedLsaId}`)
    }, [selectedLsaId]);

    return {
        lsa: data,
        isLoading,
        isError: error,
        mutateLsa: mutate,
    }
}