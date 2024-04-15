import {Box, Grid, Skeleton, Typography} from "@mui/material";
import MLU from "@/components/lsa/results/MLU";
import WPS from "@/components/lsa/results/WPS";
import TNW from "@/components/lsa/results/TNW";
import CPS from "@/components/lsa/results/CPS";
import React, {useState} from "react";
import useLsa from "@/hooks/lsa/useLsa";
import axios from "axios";
import BuildAnalysisStatus from "@/components/lsa/Dialogs/BuildAnalysisStatus";
import {useSelectedLSA} from "@/contexts/SelectedLSAContext";


export default function Results() {
    const { selectedLsaId } = useSelectedLSA();
    const {lsa, isLoading, isError, mutateLsa} = useLsa();

    if (!lsa?.mlu) {
        return (
            <Grid item>
                <Box>
                    <Skeleton variant={"rounded"} height={200} animation={false}/>
                </Box>
            </Grid>
        )
    }
    if (isLoading) {
        return (
            <Grid item>
                <Box>
                    <Skeleton variant="rectangular"  height={200} />
                </Box>
            </Grid>
        )
    }

    if (isError) {
        return (
            <Grid item>
                <Box display={"flex"} justifyContent={"center"}>
                    <Typography variant="h3" component="div">
                        Something went wrong!
                    </Typography>
                </Box>
            </Grid>
        )
    }



    return (
        <Grid item>
            <Grid container>
                <Grid item xs={3}>
                    <MLU />
                </Grid>
                <Grid item xs={3}>
                    <TNW />
                </Grid>
                <Grid item xs={3}>
                    <WPS />
                </Grid>
                <Grid item xs={3}>
                    <CPS />
                </Grid>
            </Grid>
        </Grid>
    )
}