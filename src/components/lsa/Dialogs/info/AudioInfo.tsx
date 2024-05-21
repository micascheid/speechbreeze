import InfoDialog, {InfoDialogProps} from "@/components/lsa/Dialogs/info/InfoDialog";
import {Box, List, ListItem, Typography} from "@mui/material";


export type AudioInfoProps = Omit<InfoDialogProps, 'title' | 'children'>

const AudioInfo = (props: AudioInfoProps) => {
    return (
        <InfoDialog title="Audio Management" {...props}>
            <Box mb={2}>
                <Typography variant="subtitle1">About:</Typography>
                <Typography variant="body1">
                    This section allows you to manage the audio associated with the LSA.
                </Typography>
            </Box>

            <Box mb={2}>
                <Typography variant="subtitle1">How to:</Typography>

                <ListItem dense>
                    <Typography variant="body1">
                        1.) In order to use this section, you must first select an LSA.
                    </Typography>
                </ListItem>
                <ListItem dense>
                    <Typography variant="body1">
                        2.) What you do in the audio section depends on the audio type you selected for the LSA:
                    </Typography>
                </ListItem>
                <Box ml={2} mb={2}>
                    <ListItem dense>
                        <Typography variant="body1">
                            <i>a.) Record:</i> This option allows you to record the student. Once finished, you finalize the audio. When you finalize the audio, SpeechBreeze will create a transcription for you which will be shown in the &quot;Utterance Identification&quot; section below.
                        </Typography>
                    </ListItem>
                    <ListItem dense>
                        <Typography variant="body1">
                            <i>b.) Upload:</i> Upload an audio file of a speech sample you already have. Once you finalize the audio, SpeechBreeze will create a transcription for you.
                        </Typography>
                    </ListItem>
                    <ListItem dense>
                        <Typography variant="body1">
                            <i>c.) Manual:</i> No audio file is needed and you then proceed to the &quot;Utterance Identification&quot; where you provide your own transcription of the language sample.
                        </Typography>
                    </ListItem>
                </Box>
            </Box>
        </InfoDialog>
    );
};

export default AudioInfo;

/*

About: This section allows you to manage the audio associated with the LSA

How To:
1.) In order to use you must first select an LSA first
2.) What you do in the audio section is dependent upon the audio type you selected for the LSA
    a.) Record: With this option you can record the patient. Once finsihed you finalize the audio.
        When you finalize the audio, SpeechBreeze will create a transcription for you which will be shown in the Utterance
        Selection section below
    b.) Upload: Upload an audio file of a speech sample you already have. Once you finalize the audio, SpeechBreeze will create a
        transcription for you
    c.) Manual: No audio file where you then proceed to Utterance where you provide your own transcription of the language sample.
 */

