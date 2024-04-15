import {Box, Grid, Skeleton, Stack, Typography} from "@mui/material";
import React from "react";
import useLsa from "@/hooks/lsa/useLsa";


export default function TNW() {
    const { lsa, isLoading, isError } = useLsa();

    if (isLoading) {
        return (
            <Grid item>
                <Box sx={{borderRadius: '16px'}}>
                    <Skeleton variant="rectangular" width={210} height={118} />
                </Box>
            </Grid>
        )
    }

    if (!lsa?.tnw) {
        return (
            <Grid item sx={{height: "100%"}}>
                <Stack display={"flex"} alignItems={"center"}>
                    <Typography variant={"h1"}>TNW</Typography>
                    <Typography variant="h1">
                        {lsa?.tnw}
                    </Typography>
                </Stack>
            </Grid>
        )
    }

    if (isError) {
        return (
            <Grid item>
                <Box display={"flex"} justifyContent={"center"} sx={{borderRadius: '16px'}}>
                    <Typography variant="h3" component="div">
                        Something went wrong!
                    </Typography>
                </Box>

            </Grid>
        )
    }

    return (
        <Grid item>
            <Stack display={"flex"} alignItems={"center"}>
                <Typography variant={"h1"}>WPS</Typography>
                <Typography variant="h1">
                    {lsa?.tnw}
                </Typography>
            </Stack>
        </Grid>
    );
}