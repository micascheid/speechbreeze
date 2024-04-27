import InfoDialog, {InfoDialogProps} from "@/components/lsa/Dialogs/info/InfoDialog";
import {Box, List, ListItem, Typography} from "@mui/material";


type PatientManagementInfoProps = Omit<InfoDialogProps, 'title' | 'children'>

export default function PatientManagementInfoDialog(props: PatientManagementInfoProps) {
    return (
        <InfoDialog title="Patient And LSA Creation" {...props}>
            <Box mb={2}>
                <Typography variant="subtitle1">About:</Typography>
                <Typography variant="body1">
                    In this section, you can add new patients and then create new LSAs for those patients.
                </Typography>
            </Box>

            <Box mb={2}>
                <Typography variant="subtitle1">How to:</Typography>

                <ListItem dense>
                    <Typography variant="body1">
                        <i>Patients Table:</i> Click the plus icon to add a new patient. The age field is not required.
                    </Typography>
                </ListItem>

                <ListItem dense>
                    <Typography variant="body1">
                        <i>Patients LSA Table:</i> A patient must be selected before continuing to add a new LSA for that patient.
                    </Typography>
                </ListItem>

                <Box ml={4}>
                    <Typography variant="subtitle1">Creating an LSA:</Typography>
                    <List>
                        <ListItem dense>
                            <Typography variant="body1">
                                <i>Name:</i>      Give the LSA a name.
                            </Typography>
                        </ListItem>
                        <ListItem dense>
                            <Typography variant="body1">
                                <i>Audio:</i>
                                <List>
                                    <ListItem dense>
                                        <Typography variant="body1">
                                            a.) Record a sample on the spot.
                                        </Typography>
                                    </ListItem>
                                    <ListItem dense>
                                        <Typography variant="body1">
                                            b.) Upload a previously recorded sample.
                                        </Typography>
                                    </ListItem>
                                    <ListItem dense>
                                        <Typography variant="body1">
                                            c.) No Audio - where you&apos;ll provide your own transcription manually.
                                        </Typography>
                                    </ListItem>
                                </List>
                            </Typography>
                        </ListItem>
                        <ListItem dense>
                            <Typography variant="body1">
                                <i>Transcription:</i>
                                <List>
                                    <ListItem dense>
                                        <Typography variant="body1">
                                            a.) Automated: By providing an audio source, SpeechBreeze will provide a transcription. Don&apos;t worry, you can still edit the transcription.
                                        </Typography>
                                    </ListItem>
                                    <ListItem dense>
                                        <Typography variant="body1">
                                            b.) Manual: You can choose the manual option for any audio type, but you will then provide your own transcription in the utterance identification section.
                                        </Typography>
                                    </ListItem>
                                </List>
                            </Typography>
                        </ListItem>
                    </List>
                </Box>
            </Box>
        </InfoDialog>
    );
};


/*
Title: Patient Management
About: In this section you can add new patients and then create new lsa's for those patients.

How To:
    Patients Table: Click the plus icon to add a new patient. The age feild is not required
    Patients LSA Table: A patient must be selected for continuing to add a new LSA for that patient
        Creating an LSA
        Name: Give the LSA a name
        Audio:
            a.) Record a sample on the spot
            b.) Upload a previously recorded sample
            c.) No Audio where you'll provide your own transcription manually
        Transcription:
            a.) Automated: By providing an audio source SpeechBreeze will provide a transcription. Don't worry you can edit the transcription still
            b.) Manual: You can choose manual for any audio type, but you'll then provide your own transcription in the utterance identification section

 */