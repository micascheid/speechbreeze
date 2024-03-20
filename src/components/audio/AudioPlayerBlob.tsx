import { WaveSurfer, WaveForm } from "wavesurfer-react";
import MainCard from "@/components/MainCard";
import { Card, Typography, Button } from "@mui/material";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import TimelinePlugin from "wavesurfer.js/plugins/timeline";

// Assuming blobUrl is passed as a prop to this component
export default function AudioPlayerBlob({ blobUrl }: { blobUrl: string | null }) {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const plugins = useMemo(() => {
        return [
            {
                key: "bottom-timeline",
                plugin: TimelinePlugin,
                options: {
                    height: 20,
                    container: "#timeline",
                    style: {
                        color: "#6A3274",
                    },
                },
            },
        ];
    }, []);

    const wavesurferRef = useRef<any>(null);

    const handleWSMount = useCallback((waveSurfer: any) => {
        wavesurferRef.current = waveSurfer;
        if (wavesurferRef.current && blobUrl) {
            waveSurfer.load(blobUrl);
        }
    }, [blobUrl]);

    const handlePlayPause = () => {
        if (wavesurferRef.current) {
            wavesurferRef.current.playPause();
            setIsPlaying(prevIsPlaying => !prevIsPlaying);
        }
    };

    useEffect(() => {
        if (wavesurferRef.current && blobUrl) {
            wavesurferRef.current.load(blobUrl);
        }
    }, [blobUrl]);

    return (
        <Card>
            <WaveSurfer
                onMount={handleWSMount}
                plugins={plugins}
                cursorColor={"#000"}
                container={"#waveform"}
                cursorWidth={2}

            >
                <WaveForm id={"waveform"} />
                <div id="timeline" />
            </WaveSurfer>
            <Button variant={"outlined"} onClick={handlePlayPause}>{isPlaying ? "Pause" : "Play"}</Button>
        </Card>
    );
};
