import React, {useState} from 'react';
import {Typography, Box, Popper, IconButton, ButtonGroup, Card, Grid} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import {styled} from '@mui/system';
import UtterancesTable from "@/components/lsa/UtterancesTable";

interface Utterance {
    text: string;
}

interface HighlightRange {
    start: number;
    end: number;
    text: string;
}

interface UtteranceBuilderProps {
    transcription: string;
}

const UtteranceBuilder = ({transcription}: UtteranceBuilderProps) => {
    const [selectionRange, setSelectionRange] = useState<HighlightRange | null>(null);
    const [selectionRanges, setSelectionRanges] = useState<HighlightRange[]>([]);
    const [utterances, setUtterances] = useState<Utterance[]>([]);
    const [popperAnchorEl, setPopperAnchorEl] = useState<HTMLElement | null>(null);
    const [open, setOpen] = useState(false);

    const handleTextMouseUp = (event: React.MouseEvent) => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0 && selection.toString().trim().length > 0) {
            const range = selection.getRangeAt(0);
            const text = selection.toString();
            const start = transcription.indexOf(text);
            const end = start + text.length;

            // Store the selected text together with range
            setSelectionRange({start, end, text});

            // Prepare and show the popper for confirmation
            const offsetY = 8;

            // Prepare and show the popper at the cursor's end position
            const virtualElement = {
                getBoundingClientRect: () => ({
                    top: event.clientY + offsetY, // Adjust Y position based on cursor and optional offset
                    left: event.clientX, // Position X directly at cursor
                    right: event.clientX,
                    bottom: event.clientY + offsetY,
                    width: 0,
                    height: 0,
                }),
            };
            setPopperAnchorEl(virtualElement as unknown as HTMLElement);
            setOpen(true);
        }
    };

    const handleClose = () => {
        setOpen(false);
        window.getSelection()?.removeAllRanges();
        setSelectionRange(null); // Clear the current selection range
    };

    const handleConfirm = () => {
        if (selectionRange) {
            setSelectionRanges(prev => [...prev, selectionRange]); // Add the selectionRange to selectionRanges array
            setUtterances(prev => [...prev, {text: selectionRange.text}]); // Add the selected text to utterances array
            handleClose();
        }
    };

    // Function to render text with highlights
        const renderTextWithHighlights = () => {
            let lastIndex = 0;
            const parts = [];

            // Sort the selectionRanges by start index
            const sortedRanges = [...selectionRanges].sort((a, b) => a.start - b.start);

            sortedRanges.forEach((range, index) => {
                // add normal (not highlighted)
                if (range.start > lastIndex) {
                    parts.push(
                        <span key={`normal-${index}`}>
          {transcription.slice(lastIndex, range.start)}
        </span>
                    );
                }

                // add highlighted
                parts.push(
                    <span
                        key={`highlight-${index}`}
                        style={{backgroundColor: 'yellow'}}
                    >
        {range.text}
      </span>
                );

                lastIndex = range.end;
            });

            // Append any remaining normal text
            parts.push(<span key="remaining">{transcription.slice(lastIndex)}</span>);

            return parts;
        };

    return (

        <Grid container spacing={2}>
            <Grid item xs={12} sm={9}>
                <Card>
                    <Typography
                        onMouseUp={handleTextMouseUp}
                        sx={{m: 1}}
                        fontSize={18}
                    >
                        {renderTextWithHighlights()}
                    </Typography>
                </Card>

                <Popper open={open} anchorEl={popperAnchorEl} placement="bottom">
                    <Box sx={{bgcolor: 'background.paper'}}>
                        <ButtonGroup variant="contained" aria-label="outlined primary button group">
                            <IconButton sx={{'&:hover': {backgroundColor: 'success.light'}}} onClick={handleConfirm}
                                        size="small" color="success">
                                <CheckIcon/>
                            </IconButton>
                            <IconButton sx={{'&:hover': {backgroundColor: 'error.light'}}} onClick={handleClose}
                                        size="small" color="error">
                                <CloseIcon/>
                            </IconButton>
                        </ButtonGroup>
                    </Box>
                </Popper>
            </Grid>
            <Grid item xs={12} sm={3}>
                <UtterancesTable utterances={utterances} />
            </Grid>
        </Grid>
    );
};

export default UtteranceBuilder;
