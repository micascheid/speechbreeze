import InfoDialog, {InfoDialogProps} from "@/components/lsa/Dialogs/info/InfoDialog";
import {Box, List, ListItem, Typography} from "@mui/material";


type ResultsInfoProps = Omit<InfoDialogProps, 'title' | 'children'>

const ResultsInfo = (props: ResultsInfoProps) => {
    return (
        <InfoDialog title="Results" {...props}>
            <Box>
                <Typography variant="subtitle1">About:</Typography>
                <Typography variant="body1">
                    This currently displays the results per the Sugar analysis method:
                </Typography>
                <List>
                    <ListItem dense>
                        <Typography variant="body1">
                            MLU-M (Mean Length of Utterance in Morphemes)
                        </Typography>
                    </ListItem>
                    <ListItem dense>
                        <Typography variant="body1">
                            TNW (Total Number of Words)
                        </Typography>
                    </ListItem>
                    <ListItem dense>
                        <Typography variant="body1">
                            WPS (Words Per Sentence)
                        </Typography>
                    </ListItem>
                    <ListItem dense>
                        <Typography variant="body1">
                            - CPS (Clauses Per Sentence)
                        </Typography>
                    </ListItem>
                </List>
            </Box>

            <Box mb={2}>
                <Typography variant="subtitle1">How to:</Typography>
                <Typography variant="body1">
                    You&apos;ll need to click on the, &lsquo;Get Analysis&rsquo; button in the Utterance Identification section above in order to get the results.
                </Typography>
            </Box>
        </InfoDialog>
    );
}

export default ResultsInfo;

/*
About: This currently displays the results per the Sugar analysis method
    MLU (Mean Length of Utterance)
    TNW (Total Number of Words)
    WPS (Words Per Sentence)
    CPS (Clauses Per Sentence)

How to:
    You'll need to click on the, "Get Analysis" button in the Utterance Identification
    section above in order to get the results
 */