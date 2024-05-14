import useUser from "@/hooks/useUser";
import useSWR, {mutate} from "swr";
import {fetcher} from "@/utils/axios";

export default function useLsas() {
    const {user} = useUser();
    const { data, isLoading, error } = useSWR(`/lsas/${user?.uid}`, fetcher);


    return {
        lsas: data,
        isLoading,
        isError: error,
        mutateLsas: mutate,
    }
}