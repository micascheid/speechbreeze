import React, {useEffect, useState} from 'react';
import {Typography, Box, Popper, IconButton, ButtonGroup, Card, Grid} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import {styled} from '@mui/system';
import UtterancesTable from "@/components/lsa/UtterancesTable";
import UtteranceFinalize from "@/components/lsa/UtteranceFinalize";
import useUtterances from "@/hooks/lsa/useUtterances";
import {Utterance} from "@/data/Utterance";
import {useSelectedLSA} from "@/contexts/SelectedLSAContext";

interface HighlightRange {
    start: number;
    end: number;
    text: string;
}

interface UtteranceBuilderProps {
    transcription: string;
}

const TransparentText = styled(Typography)(() => ({
    color: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    transform: "translateY(-8px)",
    '&::selection': {
        background: 'rgba(255,255,0,0.5)' // Adjust this color as needed (currently semi-transparent black)
    }
}));

const UtteranceBuilder = ({transcription}: UtteranceBuilderProps) => {
    const [selectionRange, setSelectionRange] = useState<HighlightRange | null>(null);
    const [selectionRanges, setSelectionRanges] = useState<HighlightRange[]>([]);
    const [localUtterances, setLocalUtterances] = useState<Utterance[]>([]);
    const {utterances, isLoading, isError} = useUtterances();
    const [popperAnchorEl, setPopperAnchorEl] = useState<HTMLElement | null>(null);
    const [open, setOpen] = useState(false);
    const {selectedLsaId} = useSelectedLSA();

    const handleTextMouseUp = (event: React.MouseEvent) => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0 && selection.toString().trim().length > 0) {
            const range = selection.getRangeAt(0);
            const text = selection.toString();
            const start = range.startOffset;
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

    const handleDeleteUtterance = (index: number) => {
        setLocalUtterances(prevState => prevState.filter((_, i) => i !== index));
        setSelectionRanges(prevState => prevState.filter((_, i) => i !== index));
    }

    const handleConfirm = () => {
        if (selectionRange) {
            // Prevent saving overlapping utterances
            const isOverlap = selectionRanges.some(
                (range) => !(selectionRange.end <= range.start || selectionRange.start >= range.end)
            );
            if (isOverlap) {
                window.alert('Overlap with existing utterance not allowed.'); // Provide feedback to user
                handleClose();
                return; // Do not proceed with the saving
            }

            setSelectionRanges(prev => [...prev, selectionRange]); // Add the selectionRange to selectionRanges array
            setLocalUtterances(prev => [...prev,
                {
                    lsa_id: selectedLsaId as number,
                    utterance_text: selectionRange.text,
                    utterance_order: prev.length,
                    start: selectionRange.start,
                    end: selectionRange.end
                }]);
            handleClose();
        }
    };

    let orderedUtterances: Utterance[] = [];
    if (localUtterances) {
        const sortedUtterances = [...localUtterances].sort((a, b) => a.start - b.start || a.end - b.end);
        orderedUtterances = sortedUtterances.map((utterance, index) => {
            return {...utterance, utterance_order: index};
        });
    }

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

        parts.push(<span key="remaining">{transcription.slice(lastIndex)}</span>);

        return parts;
    };

    useEffect(() => {
        if (!isLoading && utterances) {
            console.log("Received utterances: ", utterances);
            setLocalUtterances(utterances);
            const newSelectionRanges = utterances.map((utterance: Utterance) => {
                const start = utterance.start;
                const end = utterance.end;
                return {start, end, text: utterance.utterance_text};
            });

            setSelectionRanges(newSelectionRanges);
        }
    }, [isLoading, utterances]);

    return (

        <Grid container spacing={2}>
            <Grid item xs={12} sm={9}>
                <Card>
                    <Box sx={{position: 'relative'}}>
                        <Typography
                            sx={{m: 1, userSelect: 'none'}}
                            fontSize={18}
                        >
                            {renderTextWithHighlights()}
                        </Typography>
                        <TransparentText
                            onMouseUp={handleTextMouseUp}
                            sx={{m: 1, userSelect: 'text', position: 'absolute', top: 0, left: 0}}
                            fontSize={18}
                        >
                            {transcription}
                        </TransparentText>
                    </Box>
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
                <UtterancesTable utterances={orderedUtterances} onDelete={handleDeleteUtterance}/>
            </Grid>
            <Grid item xs={12}>
                <UtteranceFinalize utterances={localUtterances}/>
            </Grid>
        </Grid>
    );
};

export default UtteranceBuilder;
