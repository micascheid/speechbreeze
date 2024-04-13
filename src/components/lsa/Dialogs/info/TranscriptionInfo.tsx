import InfoDialog, {InfoDialogProps} from "@/components/lsa/Dialogs/info/InfoDialog";
import {Typography} from "@mui/material";


type TranscriptionInfoProps = Omit<InfoDialogProps, 'title' | 'children'>

const TranscriptionInfo = (props: TranscriptionInfoProps) => {
    return (
        <InfoDialog title={"Transcription Information"} {...props}>
            <Typography>Information about transcriptions</Typography>
        </InfoDialog>
    )
}