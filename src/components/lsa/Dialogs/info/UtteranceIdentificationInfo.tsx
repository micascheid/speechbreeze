import InfoDialog, {InfoDialogProps} from "@/components/lsa/Dialogs/info/InfoDialog";
import {Box, List, ListItem, Typography} from "@mui/material";


type UtteranceIdentificationInfoProps = Omit<InfoDialogProps, 'title' | 'children'>

const UtteranceIdentificationInfo = (props: UtteranceIdentificationInfoProps) => {
    return (
        <InfoDialog title="Utterance Identification" {...props}>
            <Box mb={2}>
                <Typography variant="subtitle1">About:</Typography>
                <Typography variant="body1">
                    Here you will identify the utterances in the transcript you have provided.
                </Typography>
            </Box>

            <Box mb={2}>
                <Typography variant="subtitle1">How to:</Typography>
                <List>
                    <ListItem dense>
                        <Typography variant="body1">
                            <i>1.) Transcription Finalization:</i> First edit or add your manual transcript and finalize the transcript. After finalizing the transcript, you will not be able to edit it.
                        </Typography>
                    </ListItem>
                    <ListItem dense>
                        <Typography variant="body1">
                            <i>2.) After Finalization:</i> Highlight utterances by highlighting text with the cursor. A box with a check mark and an X appears. If you like your selection, use the check mark. If you don't like your highlighted portion, use the X.
                        </Typography>
                    </ListItem>
                    <ListItem dense>
                        <Typography variant="body1">
                            <i>3.) Utterance Table:</i> you may delete any utterances you want to change by using the trash can to delete them.
                        </Typography>
                    </ListItem>
                    <ListItem dense>
                        <Typography variant="body1">
                            <i>4.) Get Analysis Button:</i> Once clicked you can expect the following flow...
                        </Typography>
                    </ListItem>
                    <Box ml={2}>
                        <ListItem dense>
                            <Typography variant="body1">
                                <i>Undetermined Morphemes:</i> SpeechBreeze provides automated morpheme counting. If SpeechBreeze can't determine the morpheme count for a word, it will provide the words it needs help on.
                            </Typography>
                        </ListItem>
                        <ListItem dense>
                            <Typography variant="body1">
                                <i>Clause Count:</i> First, SpeechBreeze will ask you to clarify any utterances that may not be sentences if it's unable to determine so. However, if the sentence contains more than 1 clause, it will ask you to input how many clauses that sentence contains.
                            </Typography>
                        </ListItem>
                    </Box>
                </List>
            </Box>
        </InfoDialog>
    );
};

export default UtteranceIdentificationInfo;


/*
About: Here you will identify the utterances in the transcript you have provided

How to:
    1.) Transcription finalization - First edit or add your manual transcript and finalize the transcript.
    After finalizing the transcript you will not be able to edit it.
    2.) With the transcription finalized you will start highlighting utterance. When you highlight an utterance a box
    with a check mark and an X appears. If you like your selection use the check mark. If you don't like your highlighted
    portion, use the X.
    3.) In the Utterances table you may delete any utterances you want to change by using the trash can to delete them

    Get Analysis:
       Once you submit the transcription for analysis you'll be prompted for the following
       Undetermined Morphemes: SpeechBreeze provides automated morpheme counting. If SpeechBreeze can't determine the
       morpheme count for a word, it will provide the words it needs help on.
       Clause Count: First SpeechBreeze will ask you to clarify any utterances that may not be sentences if its unable to determine so.
       However, if the sentence contains more than 1 clause it will ask you to input how many clauses that sentance contains.

 */