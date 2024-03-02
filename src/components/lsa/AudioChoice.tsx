import React from "react";
import {Button, Card, Stack} from "@mui/material";

export default function AudioChoice() {
    return (
        <Card>
            <Stack direction={"row"} spacing={2}>
                <Button>Record</Button>
                <Button>Upload File</Button>
                <Button>I already have a transcript</Button>
            </Stack>
        </Card>
    )
}