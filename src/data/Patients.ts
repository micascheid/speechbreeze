export interface PatientNew {
    slp_uid: string;
    name: string;
    age: number;
}

export type Patient = PatientNew & {
    patient_id: number
}