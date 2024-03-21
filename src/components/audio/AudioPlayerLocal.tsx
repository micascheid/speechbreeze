import { WaveSurfer, WaveForm } from "wavesurfer-react";
import MainCard from "@/components/MainCard";
import { Card, Typography, Button } from "@mui/material";
import RegionsPlugin from "wavesurfer.js/plugins/regions";
import TimelinePlugin from "wavesurfer.js/plugins/timeline";
import { useSelectedLSA } from "@/contexts/SelectedLSAContext";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export default function AudioPlayer() {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const { localAudioSource } = useSelectedLSA();

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
        ];
    }, []);

    const wavesurferRef = useRef();
    const handleWSMount = useCallback((waveSurfer: any) => {
        wavesurferRef.current = waveSurfer;
        if (wavesurferRef.current && localAudioSource && localAudioSource instanceof File) {
            const url = URL.createObjectURL(localAudioSource);
            waveSurfer.load(url);
            URL.revokeObjectURL(url); // Revoke the blob URL
        }
    }, [localAudioSource]);

    const handlePlayPause = () => {
        if (wavesurferRef.current) {
            // @ts-ignore
            wavesurferRef.current.playPause();
            setIsPlaying(!isPlaying);
        }
    };

    useEffect(() => {
        if (wavesurferRef.current && localAudioSource && localAudioSource instanceof File) {
            const url = URL.createObjectURL(localAudioSource);
            // @ts-ignore
            wavesurferRef.current.load(url);
            URL.revokeObjectURL(url); // Revoke the blob URL
        }
    }, [localAudioSource]);

    return (
        <Card>
            <WaveSurfer
                onMount={handleWSMount}
                plugins={plugins}
                cursorColor={"#000"}
                container={"#waveform"}
                cursorWidth={2}
            >
                <WaveForm id={"waveform"}/>
                <div id="timeline"/>
            </WaveSurfer>
            <Button variant={"outlined"} onClick={handlePlayPause}>{isPlaying ? "Pause" : "Play"}</Button>
        </Card>
    );
};