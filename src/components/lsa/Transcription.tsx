import {TextField} from "@mui/material/";
import {createTheme} from "@mui/material/styles";
import {Button} from "@mui/material";
import useLsa from "@/hooks/lsa/useLsa";

export default function Transcription() {
    const {lsa, isLoading, isError, mutateLsa} = useLsa();
    return (
        <>
            {lsa.audiofile_url ? (
                <Button>Get transcription</Button>
            ) : (
                <TextField />
            )}
        </>
    )
}