import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';


interface Utterance {
    text: string;
}

interface UtteranceTablesProps {
    utterances: Utterance[];
}

const UtterancesTable = ({ utterances }: UtteranceTablesProps) => {
    // Ensure the array is at least 10 items long by filling with empty objects if necessary
    const filledUtterances = [...utterances, ...Array(Math.max(0, 10 - utterances.length)).fill({ text: '' })];

    return (
        <TableContainer component={Paper} sx={{ maxHeight: 440}}>
            <Table stickyHeader sx={{ minWidth: 300 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Utterance</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filledUtterances.map((utterance, index) => (
                        <TableRow
                            key={index}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row" sx={{ width: '1%', whiteSpace: 'nowrap' }}>
                                {index + 1}
                            </TableCell>
                            <TableCell>{utterance.text}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default UtterancesTable;
