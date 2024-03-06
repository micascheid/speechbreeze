import useSWR, {mutate} from "swr";
import useUser from "@/hooks/useUser";
import {fetcher} from "@/utils/axios";
import {Patient} from "@/data/Patients";

export default function usePatients() {
    const user = useUser();
    console.log("user:", user?.uid);
    const {data, isLoading, error } = useSWR(`/patients?uid=${user?.uid}`, fetcher)
    console.log('data', data);
    let patientsWithFormattedDates: Patient[] = [];

    if (data) {
        patientsWithFormattedDates = data.map((patient: Patient) => ({
            ...patient,
            birthdate: new Date(patient.birthdate)
        }));
    }


    return {
        patients: patientsWithFormattedDates,
        isLoading,
        isError: error,
        mutatePatients: mutate,
    }
}