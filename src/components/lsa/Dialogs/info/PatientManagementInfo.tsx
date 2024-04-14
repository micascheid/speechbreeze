import InfoDialog, {InfoDialogProps} from "@/components/lsa/Dialogs/info/InfoDialog";
import {Typography} from "@mui/material";


type PatientManagementInfoProps = Omit<InfoDialogProps, 'title' | 'children'>

export default function PatientManagementInfoDialog(props: PatientManagementInfoProps){
    return (
        <InfoDialog title={"Patient Management Information"} {...props}>
            <Typography>Here is some info on Patient Management</Typography>
        </InfoDialog>
    );
};