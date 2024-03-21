export type Lsa = {
    lsa_id: number;
    patient_id: number;
    name: string;
    timestamp: string;
    audiofile_url: string;
    transcription: string;
    mlu: number;
    tnw: number;
    wps: number;
    cps: number;
}