import useUser from "@/hooks/useUser";
import useSWR, {mutate} from "swr";
import {fetcher} from "@/utils/axios";
import { Patient} from "@/data/Patients";

export default function useLsas() {
    const {user} = useUser();
    const { data, isLoading, error } = useSWR(`/lsas?uid=${user?.uid}`, fetcher);


    return {
        lsas: data,
        isLoading,
        isError: error,
        mutateLsas: mutate,
    }
}