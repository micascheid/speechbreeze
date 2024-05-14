import axios from '@/utils/axios';
import { openSnackbar } from '@/api/snackbar';
import { SnackbarProps } from '@/types/snackbar';


export const health_check = async () => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/health-check`);
        console.log(response.data.status);
        if (response.data.status === "down") {
            openSnackbar({
                open: true,
                message: `Attention: Our services are currently down. Please check back at a later time`,
                variant: "alert",
                alert: {
                    color: "error",
                    variant: "filled"
                },
            } as SnackbarProps);
            return false;
        }
        console.log("made it here");
        return true;
    } catch (e) {
        openSnackbar({
            open: true,
            message: `Attention: Our services are currently down. Please check back at a later time`,
            variant: "alert",
            alert: {
                color: "error",
                variant: "filled"
            },
        } as SnackbarProps);
        return false;
    }
}