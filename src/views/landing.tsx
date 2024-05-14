'use client';

import {useEffect, useState, ChangeEvent} from 'react';

// material-ui
import {alpha, useTheme} from '@mui/material/styles';
import {Button, Box, Container, Typography, Stack, Grid} from '@mui/material';

// project import


// third-party
import {presetDarkPalettes, presetPalettes, PalettesProps} from '@ant-design/colors';

// types
import {PresetColor, ThemeDirection, ThemeMode} from '@/types/config';

// assets
import LogoIcon from "@/components/logo/LogoIcon";
import {useRouter} from "next/navigation";
import {signIn} from "next-auth/react";
import Loader from "@/components/Loader";
import AuthFooter from "@/components/cards/AuthFooter";


interface ColorProps {
    id: PresetColor;
    primary: string;
}

// ==============================|| LANDING PAGE ||============================== //

const Landing = () => {
    const router = useRouter();

    const handleLogin = async () => {
        router.push('/login');
    }

    useEffect(() => {
        const existingScript = document.querySelector('#termly-resource-blocker');

        if (!existingScript) {
            const script = document.createElement('script');
            script.id = 'termly-resource-blocker';
            script.type = 'text/javascript';
            script.src = 'https://app.termly.io/resource-blocker/ae391312-5b87-44b7-bc80-618fb5b29bf7?autoBlock=on';
            document.head.appendChild(script);
        }

        return () => {
            if (existingScript) document.head.removeChild(existingScript);
        };
    }, []);

    return (
        <Container maxWidth="sm" style={{
            height: '100vh', // Ensures the container takes the full viewport height
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between', // Ensures the footer stays at the bottom
            alignItems: 'center', // Centers the content horizontally
        }}>
            <Box sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                width: '100%',
                paddingTop: '5vh',
            }}>
                <LogoIcon width={200} height={200}/>
                <Typography variant="h1" component="h1"  textAlign={"center"} gutterBottom>
                    Welcome to the Speech Breeze Application
                </Typography>
                <Box sx={{'& > *': {m: 1}}}>
                    <Stack direction="row" spacing={2}>
                        <Button variant="contained" color="primary" size="large"
                                onClick={handleLogin}>
                            Login/Sign Up
                        </Button>
                    </Stack>
                </Box>
            </Box>
            <Box display="flex" justifyContent="flex-end" sx={{ width: '100%', mb: 5 }}>
                <AuthFooter />
            </Box>
        </Container>
    );
};

export default Landing;
