import {Box, Grid, Skeleton, Stack, Typography} from "@mui/material";
import useLsa from "@/hooks/lsa/useLsa";
import React from "react";
import {useTheme} from "@mui/material/styles";

export default function MLU() {
    const {lsa, isLoading, isError, mutateLsa} = useLsa();
    const theme = useTheme();


    if (isLoading) {
        return (
            <Grid item>
                <Box sx={{borderRadius: '16px'}}>
                    <Skeleton variant="rectangular" width={210} height={118} />
                </Box>
            </Grid>
        )
    }

    if (!lsa?.mlu) {
        return (
            <Grid item sx={{height: "100%"}}>
                <Stack display={"flex"} alignItems={"center"}>
                    <Typography variant={"h1"}>MLU</Typography>
                    <Typography variant="h1">
                        {lsa?.mlu}
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
            <Stack display={"flex"} alignItems={"center"} sx={{borderRadius: '16px'}}>
                <Typography variant={"h1"}>MLU</Typography>
                <Typography variant="h1">
                    {lsa.mlu}
                </Typography>
            </Stack>
        </Grid>
    );
};