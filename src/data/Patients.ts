export interface PatientNew {
    slp_uid: string;
    name: string;
    birthdate: Date;
}

export type Patient = PatientNew & {
    patient_id: number
}