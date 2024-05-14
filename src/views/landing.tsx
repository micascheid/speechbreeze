'use client';

import {useEffect} from 'react';

// material-ui
import {Button, Box, Container, Typography, Stack} from '@mui/material';

// assets
import LogoIcon from "@/components/logo/LogoIcon";
import {useRouter} from "next/navigation";
import AuthFooter from "@/components/cards/AuthFooter";

const Landing = () => {
    const router = useRouter();

    useEffect(() => {
        // Create a script element
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://app.termly.io/resource-blocker/ae391312-5b87-44b7-bc80-618fb5b29bf7?autoBlock=on';
        script.async = true;

        // Append the script to the document head
        document.head.appendChild(script);

        // Cleanup function to remove the script when the component unmounts
        return () => {
            document.head.removeChild(script);
        };
    }, []);

    const handleLogin = async () => {
        router.push('/login');
    }

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
                <LogoIcon width={200} height={200} />
                <Typography variant="h1" component="h1" textAlign={"center"} gutterBottom>
                    Welcome to the SpeechBreeze Application
                </Typography>
                <Box sx={{ '& > *': { m: 1 } }}>
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
