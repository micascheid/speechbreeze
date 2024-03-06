import {Table, TableHead, TableRow, TableBody, TableCell, Skeleton} from "@mui/material";
import React from "react";

type TableSkeletonProps = {
    rows: number;
}

export default function TableRowsSkeleton({rows}: TableSkeletonProps) {
    return (

        <>
            {Array.from(new Array(rows)).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                    <TableCell><Skeleton animation="wave"/></TableCell>
                    <TableCell><Skeleton animation="wave"/></TableCell>
                    <TableCell><Skeleton animation="wave"/></TableCell>
                </TableRow>
            ))}

        </>


    );
};