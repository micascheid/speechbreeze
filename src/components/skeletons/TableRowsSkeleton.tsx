import {Table, TableHead, TableRow, TableBody, TableCell, Skeleton} from "@mui/material";
import React from "react";

type TableSkeletonProps = {
    rows: number;
    columns: number;
    animate: boolean;
}

export default function TableRowsSkeleton({rows, columns, animate}: TableSkeletonProps) {
    return (

        <>
            {Array.from(new Array(rows)).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                    {Array.from(new Array(columns)).map((_, head) => (
                        <TableCell key={`skeletonheader-${head}`}><Skeleton animation={animate ? "wave" : false}/></TableCell>
                    ))}
                </TableRow>
            ))}

        </>


    );
};