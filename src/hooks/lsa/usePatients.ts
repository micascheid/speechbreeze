import useSWR, {mutate} from "swr";
import useUser from "@/hooks/useUser";
import {fetcher} from "@/utils/axios";

export default function usePatients() {
    const user = useUser();
    console.log("user:", user?.uid);
    const {data, isLoading, error } = useSWR(`/patients?uid=${user?.uid}`, fetcher)
    console.log('data', data);


    return {
        patients: data,
        isLoading,
        isError: error,
        mutatePatients: mutate,
    }
}