'use client';

import {useEffect, useState, ChangeEvent} from 'react';

// material-ui
import {alpha, useTheme} from '@mui/material/styles';
import {Button, Box, Container, Typography, Stack} from '@mui/material';

// project import


// third-party
import {presetDarkPalettes, presetPalettes, PalettesProps} from '@ant-design/colors';

// types
import {PresetColor, ThemeDirection, ThemeMode} from '@/types/config';

// assets
import {CheckOutlined} from '@ant-design/icons';
import useConfig from "@/hooks/useConfig";
import Logo from "@/components/logo";
import LogoIcon from "@/components/logo/LogoIcon";
import {useRouter} from "next/navigation";
import {signIn} from "next-auth/react";
import {APP_DEFAULT_PATH} from "@/config";
import Link from "next/link";
import NextLink from "next/link";

interface ColorProps {
    id: PresetColor;
    primary: string;
}

// ==============================|| LANDING PAGE ||============================== //

const Landing = () => {
    const router = useRouter();


    return (
        <Container maxWidth="sm" style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start', // Align items to the start of the container
            alignItems: 'center',
            marginTop: '25vh' // Moves everything down to 3/8 of the viewport's height
        }}>
            <LogoIcon width={200} height={200}/>
            <Typography variant="h1" component="h1" gutterBottom>
                Welcome to Speech Breeze
            </Typography>
            <Box sx={{'& > *': {m: 1}}}>
                <Stack direction={"row"} spacing={2}>
                    <NextLink href={"/login"}>
                        <Button sx={{width: 100}} variant="contained" color="primary" size="large">
                            Login
                        </Button>
                    </NextLink>

                    <NextLink href={'/register'}>
                        <Button sx={{width: 100}} variant="contained" color="primary" size="large">
                            Register
                        </Button>
                    </NextLink>

                </Stack>
            </Box>
        </Container>

    );
};

export default Landing;
