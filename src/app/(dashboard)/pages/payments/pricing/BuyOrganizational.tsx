'use client'
import React, { useEffect, useState } from 'react';
import {Box, Button, Stack, Typography} from "@mui/material";
import {bool} from "yup";
import {styled} from "@mui/material/styles";
import theme from "@/themes/theme";
import ContactUsDialog from "@/components/ContactUsDialog";

const TypographyBulleted = styled(Typography)(({ theme }) => ({
    fontSize: '1.2rem',
}));


function BuyOrganizational() {
    const [openDialog, setOpenDialog] = useState(false);

    const handleContactUs = () => {
        setOpenDialog(true);
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            height={312}
            padding={2}
        >
            {/* Content at the top */}
            <Box>
                <TypographyBulleted variant="body1">&bull; Per seat pricing at 99/yr</TypographyBulleted>
                <TypographyBulleted variant="body1">&bull; Flexible billing cycle</TypographyBulleted>
                <TypographyBulleted variant="body1">&bull; Effortless group member account setup</TypographyBulleted>
            </Box>

            {/* Content at the bottom */}
            <Box display={"flex"} justifyContent={"center"} mb={1}>
                {/*<Divider sx={{ my: 2 }} />*/}
                <Button
                    variant={"contained"}
                    onClick={handleContactUs}
                    sx={{width: 264, height: 44, borderRadius: 1.5, fontSize: '1.1rem'}}
                >Contact Us</Button>
                <ContactUsDialog openDialog={openDialog} setOpenDialog={setOpenDialog}/>
            </Box>
        </Box>
    );
}

export default BuyOrganizational;