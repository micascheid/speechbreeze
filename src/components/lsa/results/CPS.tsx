import {Box, Grid, Stack, Typography} from "@mui/material";
import React from "react";


export default function CPS() {


    return (
        <Grid item>
            <Stack display={"flex"} alignItems={"center"}>
                <Typography variant={"h1"}>CPS</Typography>
                <Typography variant="h1">
                    {Math.floor(Math.random() * 10)}
                </Typography>
            </Stack>
        </Grid>
    )
}