interface SLP {
    slp_id: string;
    account_creation_epoch: number;
    name: string | null;
    email: string;
    sub_type: number | null;
    stripe_id: string | null;
    sub_start: number | null;
    sub_end: number | null;
    org_id: number | null;
}