'use client'
import React, { useEffect, useState } from 'react';
import {Box, Stack, Typography} from "@mui/material";
import {bool} from "yup";
import {styled} from "@mui/material/styles";
import theme from "@/themes/theme";

const TypographyBulleted = styled(Typography)(({ theme }) => ({
    fontSize: '1.2rem',
}));


function BuyOrganizational() {

    return (
        <Stack>

            <Typography textAlign={"center"} mb={2} variant={"h4"}>Organizations</Typography>
            <Box mb={2}>
                <TypographyBulleted variant={"body1"}>&bull; Per seat pricing at 99/yr</TypographyBulleted>
                <TypographyBulleted variant={"body1"}>&bull; Billing in line with your billing cycle</TypographyBulleted>
                <TypographyBulleted variant={"body1"}>&bull; Employees enter a provided code to begin use.</TypographyBulleted>
            </Box>
            <Box>
                <Typography variant={"subtitle1"} sx={{ fontSize: '1rem',}}>Get your staff on board today by contacting:</Typography>
                <Typography>support@speechbreeze.com</Typography>
            </Box>

        </Stack>


    );
}

export default BuyOrganizational;