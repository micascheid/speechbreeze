import useSWR from "swr";
import {fetcher, fetcherPost} from "@/utils/axios";
import useUser from "@/hooks/useUser";

export default function useMLU() {
    const {user} = useUser();
    const { data, error, isLoading } = useSWR('/mlu', fetcher)


    return {
        mlu: data,
        isLoading,
        isError: error
    }
}