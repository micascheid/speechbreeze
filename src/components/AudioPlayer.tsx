import { WaveSurfer, WaveForm, Region, Marker} from "wavesurfer-react";
import MainCard from "@/components/MainCard";
import {Card, Typography, Button} from "@mui/material";
import {useCallback, useMemo, useRef, useState} from "react";
import RegionsPlugin from "wavesurfer.js/plugins/regions";
import TimelinePlugin from "wavesurfer.js/plugins/timeline";
import waveSurfer from "wavesurfer-react/src/containers/WaveSurfer";


export default function AudioPlayer() {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    // const [timelineVis, setTimelineVis] = useState<boolean>(true);
    const plugins = useMemo(() => {
        return [
            {
                key: "bottom-timeline",
                plugin: TimelinePlugin,
                options: {
                    height: 20,
                    style: {
                        color: "#6A3274",
                    },
                },
            },
        ].filter(Boolean);
    }, []);

    const wavesurferRef = useRef();
    const handleWSMount = useCallback((waveSurfer: any) => {
        wavesurferRef.current = waveSurfer;
        if (wavesurferRef.current) {
            waveSurfer.load("/assets/audio/test.mp3");
        }

    }, []);

    const handlePlayPause = () => {
        if (wavesurferRef.current) {
            wavesurferRef.current.playPause();
            setIsPlaying(!isPlaying);
        }
    };


    return (
        <Card>
            <WaveSurfer
                onMount={handleWSMount}
                plugins={plugins}
                cursorColor={"transparent"}
                container={"#waveform"}
            >
                <WaveForm id={"waveform"}/>
                <div id="timeline"/>
            </WaveSurfer>
            <Button variant={"outlined"} onClick={handlePlayPause}>{isPlaying ? "Pause" : "Play"}</Button>
        </Card>
    );
};