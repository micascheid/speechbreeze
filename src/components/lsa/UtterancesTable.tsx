import React from 'react';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton} from '@mui/material';
import {Utterance} from "@/data/Utterance";
import DeleteIcon from '@mui/icons-material/Delete';
import {useTheme} from "@mui/material/styles";

interface UtteranceTablesProps {
    utterances: Utterance[];
    onDelete: (index: number) => void;
}

const UtterancesTable = ({utterances, onDelete}: UtteranceTablesProps) => {
    // Ensure the array is at least 10 items long by filling with empty objects if necessary
    const filledUtterances = [...utterances, ...Array(Math.max(0, 10 - utterances.length)).fill({utterance_text: ''})];
    const theme = useTheme();
    console.log("utterances", utterances);
    return (
        <TableContainer component={Paper} sx={{maxHeight: 440}}>
            <Table stickyHeader sx={{minWidth: 300}} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Utterance</TableCell>
                        <TableCell>Action</TableCell>
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
                                    <IconButton aria-label="delete" onClick={() => onDelete(index)}>
                                        <DeleteIcon color={"error"}/>
                                    </IconButton>
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
