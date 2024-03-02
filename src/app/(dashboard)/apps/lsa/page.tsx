'use client'
import { useState } from 'react';
import { Button, Card, Stack, Typography } from '@mui/material';
import MainCard from '@/components/MainCard';
import axios from 'axios';
import useSWR from 'swr';
import useMLU from "@/hooks/lsa/useMLU";
import AudioChoice from "@/components/lsa/AudioChoice";
import Transcription from "@/components/lsa/Transcription";
import PatientInfo from "@/components/lsa/PatientInfo";
import useUser from "@/hooks/useUser";
// import {fetcher} from "@/utils/axios";


// Define the fetcher function using Axios
export default function LsaTool() {
    const user = useUser();
    const { mlu, isError, isLoading }  = useMLU();



    return (
        <MainCard>
            <Stack spacing={2}>
                <Typography>Hello user: {user?.uid}</Typography>
                <PatientInfo />
                <AudioChoice />
                <Transcription />
                <Typography>{mlu?.total}</Typography>
            </Stack>

        </MainCard>
    );
}
