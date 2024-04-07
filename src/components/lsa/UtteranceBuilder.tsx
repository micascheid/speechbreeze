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
            const rangeStart = range.startOffset;
            const rangeEnd = rangeStart + text.length;
            const clickedElement = event.target as Element;

            // Find the text index of the paragraph in the transcription
            const paragraphIndex =   Array.from(clickedElement.parentElement?.children || []).findIndex(para => para === clickedElement);

            // Count characters in all paragraphs before this one
            let charsBefore = 0;
            for (let i = 0; i < paragraphIndex; i++) {
                // "+ 1" to count the previously stripped newline character
                charsBefore += clickedElement.parentElement?.children.item(i)?.textContent?.length + 1 || 0;
            }

            // Set the selection range to account for characters in previous paragraphs
            const start = charsBefore + rangeStart;
            const end = start + text.length;

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
            // This checks if the start OR end of the new range falls within any existing range.
            const isOverlap = selectionRanges.some(
                (range) => (selectionRange.start >= range.start && selectionRange.start <= range.end) ||
                    (selectionRange.end >= range.start && selectionRange.end <= range.end)
            );

            if (isOverlap) {
                window.alert('Overlap with existing utterance not allowed.'); // Provide feedback to user
                handleClose();
                return; // Do not proceed with the saving
            }

            // If no overlaps, proceed as normal
            setSelectionRanges(prev => [...prev, selectionRange]);
            setLocalUtterances(prev => [...prev,
                {
                    lsa_id: selectedLsaId as number,
                    utterance_text: selectionRange.text,
                    utterance_order: prev.length,
                    start: selectionRange.start,
                    end: selectionRange.end
                }
            ]);
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
        const lines = transcription.split('\n'); // split transcription into lines
        let accumulatedLength = 0;

        return lines.map((line, lineIndex) => { // wrap each line in a paragraph tag
            let lineContent = [];
            let lastIndex = 0;

            const sortedRanges = [...selectionRanges]
                .filter(range => range.start >= accumulatedLength && range.end <= accumulatedLength + line.length)
                .sort((a, b) => a.start - b.start);

            sortedRanges.forEach((range, index) => {
                const rangeStart = range.start - accumulatedLength;
                const rangeEnd = range.end - accumulatedLength;

                // Add normal (not highlighted)
                if (rangeStart > lastIndex) {
                    lineContent.push(
                        <span key={`normal-${lineIndex}-${index}`}>
            {line.slice(lastIndex, rangeStart)}
          </span>
                    );
                }

                // Add highlighted
                lineContent.push(
                    <span
                        key={`highlight-${lineIndex}-${index}`}
                        style={{ backgroundColor: 'yellow' }}
                    >
          {line.slice(rangeStart, rangeEnd)}
        </span>
                );

                lastIndex = rangeEnd;
            });

            lineContent.push(<span key={`remaining-${lineIndex}`}>{line.slice(lastIndex)}</span>);

            accumulatedLength += line.length + 1; // +1 for newline character

            return (
                <p key={`line-${lineIndex}`}>{lineContent}</p>
            );
        });
    };

    const renderTransparentText = () => {
        const lines = transcription.split('\n'); // Split transcription into lines
        return lines.map((line, lineIndex) => (
            <p key={`line-${lineIndex}`}>{line}</p>
        ));
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
                            {renderTransparentText()}
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