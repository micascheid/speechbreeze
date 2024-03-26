import useLsa from "@/hooks/lsa/useLsa";
import {Typography} from "@mui/material";


export default function UtteranceBuilder() {
    const { lsa, } = useLsa();

    return (
        <Typography>Identify each utterance by click at the end of it.</Typography>
    );
}