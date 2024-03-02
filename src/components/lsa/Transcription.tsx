import {TextField} from "@mui/material/";
import {createTheme} from "@mui/material/styles";

export default function Transcription() {

    return (
        <TextField
            label="Multiline"
            multiline
            rows={5}
            // Apply styles specifically to this TextField
            sx={{
                width: '100%', // Adjust width as needed
                '& .MuiInputBase-input': {
                    fontSize: '16px', // Set the font size to 16
                },
            }}
            placeholder="Enter your text here"
            variant="outlined"
        />
    )
}