import InfoDialog, {InfoDialogProps} from "@/components/lsa/Dialogs/info/InfoDialog";
import {Typography} from "@mui/material";


type ResultsInfoProps = Omit<InfoDialogProps, 'title' | 'children'>

const ResultsInfo = (props: ResultsInfoProps) => {
    return (
        <InfoDialog title={"Results Information"} {...props}>
            <Typography>Information about results</Typography>
        </InfoDialog>
    )
}

export default ResultsInfo;