import {Box, Grid, Stack, Typography} from "@mui/material";
import React from "react";
import useLsa from "@/hooks/lsa/useLsa";


export default function TNW() {
    const { lsa } = useLsa();

    return (
        <Grid item>
            <Stack display={"flex"} alignItems={"center"}>
                <Typography variant={"h1"}>TNW</Typography>
                <Typography variant="h1">
                    {lsa?.tnw}
                </Typography>
            </Stack>
        </Grid>
    )
}