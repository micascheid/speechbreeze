import InfoDialog, {InfoDialogProps} from "@/components/lsa/Dialogs/info/InfoDialog";
import {Typography} from "@mui/material";


type AudioInfoProps = Omit<InfoDialogProps, 'title' | 'children'>

const AudioInfo = (props: AudioInfoProps) => {
    return (
        <InfoDialog title={"Audio Info Information"} {...props}>
            <Typography>Information about audio</Typography>
        </InfoDialog>
    )
}