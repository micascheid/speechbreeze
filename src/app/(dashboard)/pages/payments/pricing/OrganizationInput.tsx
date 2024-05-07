import {Box, Button, Stack, TextField, Typography} from "@mui/material";
import React, {useState} from "react";
import LoadingButton from '@mui/lab/LoadingButton';
import useUser from "@/hooks/useUser";
import axios from "@/utils/axios";
import {event} from "next/dist/build/output/log";
import {mutate} from "swr";
import {openSnackbar} from "@/api/snackbar";
import {SnackbarProps} from "@/types/snackbar";

export default function OrganizationInput() {
    const [isSubmit, setIsSubmit] = useState(false);
    const [orgCodeEntryError, setOrgCodeEntryError] = useState<string>('');
    const {user, mutateUser} = useUser();
    const isDisabled = user?.sub_type === 3;
    const [localOrgCode, setLocalOrgCode] = useState<string>('');
    const message: string = "Enter the code provided by your organization below to obtain access"

    const validateOrgCode = (input: string) => {
        if (input === "") {
            return "";
        }
        const regex = /^[A-Za-z0-9-]+$/;
        if (!regex.test(input)) {
            return "Allowed: letters, numbers, hyphens.";
        }
        return "";
    };



    const handleOrgCodeSubmit = async () => {
        setIsSubmit(true);
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${user?.email}/add-to-org`, { "org_code": localOrgCode });
            await mutateUser(`/slp/${user?.uid}`)
            openSnackbar({
                open: true,
                message: `Wahooo! You may now start using SpeechBreeze`,
                variant: "alert",
                alert: {
                    color: "success",
                    variant: "filled"
                },
            } as SnackbarProps);
        } catch (e) {
            openSnackbar({
                open: true,
                message: `We're having trouble finding that org, please check your code.`,
                variant: "alert",
                alert: {
                    color: "error",
                    variant: "filled"
                },
            } as SnackbarProps);
            setIsSubmit(false);
            setOrgCodeEntryError("An error occurred while submitting. Please try again.");
        } finally {
            setIsSubmit(false);
        }
    }

    const handleOrgCode = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value;
        const error = validateOrgCode(input);
        setOrgCodeEntryError(error);
        setLocalOrgCode(input);
    }
    const isSubmitDisabled = localOrgCode === "" || !!orgCodeEntryError;
    return (
        <Stack>
            {user?.sub_type === 3 &&
                <Typography variant={"subtitle1"} sx={{fontSize: '1.2rem'}}>Your Current Plan</Typography>
            }
            <Box
                sx={{
                    opacity: isDisabled ? 0.5 : 1, // Change opacity
                    cursor: isDisabled ? 'not-allowed' : 'default', // Change cursor
                    pointerEvents: isDisabled ? 'none' : 'auto', // Disable interaction
                }}
            >
                <Typography variant={"body1"} sx={{mb: 1}}>{message}</Typography>
                <TextField
                    onChange={handleOrgCode}
                    error={!!orgCodeEntryError}
                    helperText={orgCodeEntryError}
                    sx={{width: '215px'}}
                >
                </TextField>
                <LoadingButton
                    loading={isSubmit}
                    loadingIndicator="Submitting"
                    onClick={handleOrgCodeSubmit}
                    disabled={isSubmitDisabled}
                    variant={"contained"} sx={{ml: 1}}>
                    Submit
                </LoadingButton>
            </Box>
        </Stack>

    )
}