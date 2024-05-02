import React, {useState} from "react";
import OtpInput from "react18-input-otp";
import {Button, Stack, Typography} from "@mui/material";
import {MuiOtpInput} from "mui-one-time-password-input";
import {confirmSignUp} from "@/utils/auth/auth";
import {useRouter} from "next/navigation";


interface FormErrors {
    code?: string; // Error message for the code field
    submit?: string; // General submission error
}

interface ConfirmationFormProps {
    res: any
}

const ConfirmationForm = ({res}: ConfirmationFormProps) => {
    const [otp, setOtp] = React.useState('')
    const [canSubmit, setCanSubmit] = useState(false);
    const email = res['data']['CodeDeliveryDetails']['Destination'];
    const userSub = res['data']['UserSub'];
    const router = useRouter();
    const handleChange = (newValue: any) => {
        setOtp(newValue)
        if (newValue.length < 6) {
            setCanSubmit(false);
        }
    }

    const handleComplete = () => {
        setCanSubmit(true);
    }

    function matchIsString(text: string) {
        return typeof text === 'string';
    }

    function matchIsNumeric(text: any) {
        const isNumber = typeof text === 'number'
        const isString = matchIsString(text)
        return (isNumber || (isString && text !== '')) && !isNaN(Number(text))
    }

    const validateChar = (value: any, index: number) => {
        return matchIsNumeric(value)
    }

    const handleConfirm = async () => {
        try {
            if (canSubmit) {
                await confirmSignUp(userSub, otp.toString());
                router.push('/login');
            }
        } catch (error) {
            console.error("Error during confirmation:", error);
            // Optionally update UI with error feedback
        }
    };

    return (
        <Stack spacing={2}>
            <Typography>We sent a code to: {email}</Typography>
            <MuiOtpInput
                length={6}
                value={otp}
                onChange={handleChange}
                onComplete={handleComplete}
                validateChar={validateChar}
            />
            <Button
                disabled={!canSubmit}
                variant={"contained"}
                onClick={handleConfirm}
            >
                Submit
            </Button>
        </Stack>


    );
};

export default ConfirmationForm;