'use client'
import { useState } from 'react';
import {Button, Card, Grid, Stack, Typography} from '@mui/material';
import MainCard from '@/components/MainCard';
import axios from 'axios';
import useSWR from 'swr';
import useMLU from "@/hooks/lsa/useMLU";
import AudioChoice from "@/components/lsa/AudioChoice";
import Transcription from "@/components/lsa/Transcription";
import PatientInfo from "@/components/lsa/PatientInfo";
import useUser from "@/hooks/useUser";
import AudioPlayer from "@/components/AudioPlayer";
import PatientSelector from "@/components/lsa/PatientSelector";
// import {fetcher} from "@/utils/axios";


// Define the fetcher function using Axios
export default function LsaTool() {
    const user = useUser();

    return (
        <MainCard>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <PatientSelector />
                </Grid>
                <Grid item xs={12}>
                    <AudioChoice />
                </Grid>
                <Grid item xs={12}>
                    <AudioPlayer />
                </Grid>
                <Grid item xs={12}>
                    <Transcription />
                </Grid>
            </Grid>
        </MainCard>
    );
}
