import React, {useState} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import {Stack, Typography} from "@mui/material";


const ContactUsBox = () => {


    return (
        <Stack>
            <Typography variant={"subtitle2"}>Info:</Typography>
            <Typography variant="body1">
                Email: micalinscheid@speechbreeze.com
            </Typography>
            <Typography variant="body1">
                Phone: +1 907 942 2446
            </Typography>
        </Stack>
    );
};

export default ContactUsBox;