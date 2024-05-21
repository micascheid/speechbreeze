import InfoDialog, {InfoDialogProps} from "@/components/lsa/Dialogs/info/InfoDialog";
import {Box, List, ListItem, Typography} from "@mui/material";


type PatientManagementInfoProps = Omit<InfoDialogProps, 'title' | 'children'>

export default function PatientManagementInfoDialog(props: PatientManagementInfoProps) {
    return (
        <InfoDialog title="Student and LSA Creation" {...props}>
            <Box mb={2}>
                <Typography variant="subtitle1">About:</Typography>
                <Typography variant="body1">
                    In this section, you can add new students and then create new LSAs for those students.
                </Typography>
            </Box>

            <Box mb={2}>
                <Typography variant="subtitle1">How to:</Typography>

                <ListItem dense>
                    <Typography variant="body1" component="div">
                        <i>Students Table:</i> Click the plus icon to add a new student. The age field is not required.
                    </Typography>
                </ListItem>

                <ListItem dense>
                    <Typography variant="body1" component="div">
                        <i>Students LSA Table:</i> A student must be selected before continuing to add a new LSA for that student.
                    </Typography>
                </ListItem>

                <Box ml={4}>
                    <Typography variant="subtitle1">Creating an LSA:</Typography>
                    <List>
                        <ListItem dense>
                            <Typography variant="body1" component="div">
                                <i>Name:</i>      Give the LSA a name.
                            </Typography>
                        </ListItem>
                        <ListItem dense>
                            <Typography variant="body1" component="div">
                                <i>Audio:</i>
                                <List>
                                    <ListItem dense>
                                        <Typography variant="body1" component="div">
                                            a.) Record a sample on the spot.
                                        </Typography>
                                    </ListItem>
                                    <ListItem dense>
                                        <Typography variant="body1" component="div">
                                            b.) Upload a previously recorded sample.
                                        </Typography>
                                    </ListItem>
                                    <ListItem dense>
                                        <Typography variant="body1" component="div">
                                            c.) No Audio - where you&apos;ll provide your own transcription manually.
                                        </Typography>
                                    </ListItem>
                                </List>
                            </Typography>
                        </ListItem>
                        <ListItem dense>
                            <Typography variant="body1" component="div">
                                <i>Transcription:</i>
                                <List>
                                    <ListItem dense>
                                        <Typography variant="body1" component="div">
                                            a.) Automated: By providing an audio source, SpeechBreeze will provide a transcription. Don&apos;t worry, you can still edit the transcription.
                                        </Typography>
                                    </ListItem>
                                    <ListItem dense>
                                        <Typography variant="body1" component="div">
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