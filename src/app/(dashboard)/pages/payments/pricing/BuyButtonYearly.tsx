'use client'
import React, { useEffect, useState } from 'react';
import useUser from "@/hooks/useUser";
import {Box, Stack, Typography} from "@mui/material";
import {bool} from "yup";

type BuyButtonYearlyProps = {
    planType: number
}

function BuyButtonYearly({planType}: BuyButtonYearlyProps) {
    const [isStripeLoaded, setStripeLoaded] = useState(false);
    const {user} = useUser();
    const isDisabled = planType > 0;
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://js.stripe.com/v3/buy-button.js";
        script.async = true;
        script.onload = () => setStripeLoaded(true);
        document.head.appendChild(script);
        return () => {
            document.head.removeChild(script);
        }
    }, []);

    if (!isStripeLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <Stack alignItems={"center"}>
            {planType === 2 && (
                <Typography variant={"subtitle1"} sx={{fontSize: '1.2rem'}}>Your Current Plan</Typography>
            )}
            <Box
                sx={{
                    opacity: isDisabled ? 0.5 : 1, // Change opacity
                    cursor: isDisabled ? 'not-allowed' : 'default', // Change cursor
                    pointerEvents: isDisabled ? 'none' : 'auto', // Disable interaction
                }}
            >
                <stripe-buy-button
                    buy-button-id="buy_btn_1P8vCLEnGNPnb7LNYtWtu7wm"
                    publishable-key="pk_test_51MsrllEnGNPnb7LN960TqSCAhliTPFORSwLNlAdKVeHsH2kYxU8uNnstGNc8tCk68wyNYjafhK74QEuNssReWnvf00MNKkitrz"
                    client-reference-id={user?.uid}
                    customer-email={user?.email}
                />
            </Box>

        </Stack>

    );
}

export default BuyButtonYearly;