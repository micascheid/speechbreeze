import useUser from "@/hooks/useUser";
import useSWR, {mutate} from "swr";
import {fetcher} from "@/utils/axios";
import { Patient} from "@/data/Patients";

export default function useLsa() {
    const user = useUser();
    const { data, isLoading, error } = useSWR(`/lsa?uid=${user?.uid}`, fetcher);

    console.log("LSA DATA:", data);
    return {
        lsas: data,
        isLoading,
        isError: error,
        mutateLsas: mutate,
    }
}