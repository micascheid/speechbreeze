export enum sentence_status {
    False = 'false',
    True = 'true',
    Unsure = 'unsure'
}

export type Utterance = {
    lsa_id: number;
    utterance_text: string;
    utterance_order: number;
    start: number;
    end: number;
    morph_sugar_count: number;
    sentence: sentence_status;
    clause_count: number;

}