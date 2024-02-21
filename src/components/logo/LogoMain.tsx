'use client';

// material-ui
import {useTheme} from '@mui/material/styles';


import '@fontsource/nunito/400.css';

// types
import {ThemeMode} from '@/types/config';

import Image from 'next/image';
import {Box, Typography} from "@mui/material";
import Theme from "@/themes/theme";

const logoDark = '/assets/images/logo-dark.svg';
const logo = '/assets/images/logo-icon.svg';

// ==============================|| LOGO SVG ||============================== //

const LogoMain = ({reverse, ...others}: { reverse?: boolean }) => {
    const theme = useTheme();
    return (
        <>
            <Box marginRight={2}>
                <Image
                    src={theme.palette.mode === ThemeMode.DARK ? logoDark : logo}
                    alt="SpeechBreeze"
                    width={35}
                    height={35}
                    {...others}
                />
            </Box>

            <Typography variant={"h3"} sx={{ fontFamily: 'Nunito' }}>SpeechBreeze</Typography>
        </>

    );
};

export default LogoMain;
