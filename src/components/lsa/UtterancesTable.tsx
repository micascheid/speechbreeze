import React from 'react';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Box} from '@mui/material';
import {Utterance} from "@/data/Utterance";
import DeleteIcon from '@mui/icons-material/Delete';
import {useTheme} from "@mui/material/styles";
import useLsa from "@/hooks/lsa/useLsa";

interface UtteranceTablesProps {
    utterances: Utterance[];
    onDelete: (index: number) => void;
}

const UtterancesTable = ({utterances, onDelete}: UtteranceTablesProps) => {
    // Ensure the array is at least 10 items long by filling with empty objects if necessary
    const {lsa, isLoading, isError, mutateLsa} = useLsa();
    const filledUtterances = [...utterances, ...Array(Math.max(0, 10 - utterances.length)).fill({utterance_text: ''})];
    const theme = useTheme();
    return (
        <TableContainer component={Paper} sx={{maxHeight: 440}}>
            <Table stickyHeader sx={{minWidth: 300}} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Utterance</TableCell>
                        <TableCell style={{width: '1%'}}>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filledUtterances.map((utterance, index) => (
                        <TableRow
                            key={index}
                            sx={{
                                '&:last-child td, &:last-child th': {border: 0},
                                backgroundColor: utterance.utterance_text ? 'inherit' : theme.palette.secondary.light
                            }}
                        >
                            <TableCell component="th" scope="row" sx={{width: '1%', whiteSpace: 'nowrap'}}>
                                {index + 1}
                            </TableCell>
                            <TableCell>{utterance.utterance_text}</TableCell>
                            <TableCell align={"center"}>
                                {utterance.utterance_text &&
                                    <Box display="flex" justifyContent="center">
                                        <IconButton aria-label="delete" onClick={() => onDelete(index)}>
                                            <DeleteIcon color={"error"}/>
                                        </IconButton>
                                    </Box>
                                }
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default UtterancesTable;
