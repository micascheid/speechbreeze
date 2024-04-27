import {Dialog, DialogContent, DialogTitle, IconButton, List, ListItem, Stack, Typography} from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";

type ContactUsDialogProps = {
    openDialog: boolean;
    setOpenDialog: (setOpen: boolean) => void;
}

export default function ContactUsDialog({openDialog, setOpenDialog}: ContactUsDialogProps){

    const handleClose = () => {
        setOpenDialog(false);
    }

    return (
        <Dialog open={openDialog} onClose={handleClose}>
            <IconButton>
                <CloseIcon fontSize={"medium"} onClick={handleClose}/>
            </IconButton>
            <DialogTitle sx={{textAlign: "center", fontSize: '1.2rem'}}>Organization Subscription</DialogTitle>
            <DialogContent>
                <Typography variant="subtitle1" fontSize={'1.1rem'}>How it Works:</Typography>
                <Typography variant="body1" gutterBottom fontSize={'1.1rem'}>
                    SpeechBreeze will work with your organization&apos;s billing cycle to make payments as simple as possible.
                    Regardless of the payment structure, it equates to $99 a year per seat.
                </Typography>

                {/* Onboarding Process */}
                <Typography variant="subtitle1" fontSize={'1.1rem'}>Onboarding:</Typography>
                <List>
                    <ListItem>
                        <Typography variant="body1" fontSize={'1.1rem'}>
                            1. Provide SpeechBreeze with a list of emails your SLPs will be signing up with.
                        </Typography>
                    </ListItem>
                    <ListItem>
                        <Typography variant="body1" fontSize={'1.1rem'}>
                            2. SpeechBreeze will provide your organization with a code.
                        </Typography>
                    </ListItem>
                    <ListItem>
                        <Typography variant="body1" fontSize={'1.1rem'}>
                            3. SLPs enter the code into SpeechBreeze application for access.
                        </Typography>
                    </ListItem>
                </List>
                <Stack alignItems={"center"}>
                    <Typography variant="subtitle1" fontSize={'1.1rem'}>Contact Us</Typography>
                    <Typography variant="body1" fontSize={'1.1rem'}>
                        support@speechbreeze.com
                    </Typography>
                    <Typography variant="body1" fontSize={'1.1rem'}>
                        or
                    </Typography>
                    <Typography variant="body1" fontSize={'1.1rem'}>
                        907-942-2446
                    </Typography>
                </Stack>
            </DialogContent>
        </Dialog>
    )
}

/*
How it works:
Payment:
SpeechBreeze will work with your organizations billing cycle to make payments as simple as possible.
Regardless of payment structure, it will equate to $99 a year per seat

Onboarding:
1.) Provide SpeechBreeze a list of emails of the SLPs that will be signing up to SpeechBreeze
2.) SpeechBreeze will provide your oranization an organization code
3.) SLPs will input that code into the application and off they go!
 */