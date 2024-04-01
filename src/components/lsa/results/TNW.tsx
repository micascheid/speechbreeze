import {Box, Grid, Stack, Typography} from "@mui/material";
import React from "react";


export default function TNW() {


    return (
        <Grid item>
            <Stack display={"flex"} alignItems={"center"}>
                <Typography variant={"h1"}>TNW</Typography>
                <Typography variant="h1">
                    {Math.floor(Math.random() * 10)}
                </Typography>
            </Stack>
        </Grid>
    )
}