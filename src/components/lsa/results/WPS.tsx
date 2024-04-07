import {Box, Grid, Stack, Typography} from "@mui/material";
import React from "react";
import useLsa from "@/hooks/lsa/useLsa";


export default function WPS() {
    const { lsa } = useLsa();

    return (
        <Grid item>
            <Stack display={"flex"} alignItems={"center"}>
                <Typography variant={"h1"}>WPS</Typography>
                <Typography variant="h1">
                    {lsa?.wps}
                </Typography>
            </Stack>
        </Grid>
    )
}