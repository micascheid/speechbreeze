import {Box, Grid, Stack, Typography} from "@mui/material";
import React from "react";
import useLsa from "@/hooks/lsa/useLsa";


export default function CPS() {
    const { lsa } = useLsa();

    return (
        <Grid item>
            <Stack display={"flex"} alignItems={"center"}>
                <Typography variant={"h1"}>CPS</Typography>
                <Typography variant="h1">
                    {lsa?.cps}
                </Typography>
            </Stack>
        </Grid>
    )
}