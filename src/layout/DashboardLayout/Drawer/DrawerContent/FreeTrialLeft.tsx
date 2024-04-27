import {Box, Button, Link, Stack, Typography} from "@mui/material";
import useUser from "@/hooks/useUser";
import AnimateButton from "@/components/@extended/AnimateButton";
import MainCard from "@/components/MainCard";


export default function FreeTrialLeft() {
    const {user} = useUser();
    const trialToDays = () => {
        const secondsPerDay = 24 * 60 * 60;

        return Math.floor(user?.free_trial_left!/secondsPerDay).toString();

    }
    const trialDaysLeft = trialToDays();

    return (
        <MainCard sx={{ bgcolor: 'grey.50', m: 3 }}>
            <Stack alignItems="center" spacing={2.5}>
                <Stack alignItems="center">
                    <Typography variant="h5">Trial Days Left</Typography>
                    <Typography variant="h5" color="secondary">
                        {trialDaysLeft}
                    </Typography>
                </Stack>
            </Stack>
        </MainCard>
    )
}