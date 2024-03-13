import { WaveSurfer, WaveForm, Region, Marker} from "wavesurfer-react";
import MainCard from "@/components/MainCard";
import {Card, Typography, Button} from "@mui/material";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import RegionsPlugin from "wavesurfer.js/plugins/regions";
import TimelinePlugin from "wavesurfer.js/plugins/timeline";
import waveSurfer from "wavesurfer-react/src/containers/WaveSurfer";
import {useSelectedLSA} from "@/contexts/SelectedLSAContext";
import useSWR from "swr";
import {fetcher} from "@/utils/axios";


export default function AudioPlayer() {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const { selectedLsaId, audioFileUrl } = useSelectedLSA();
    const { data, isLoading, error } = useSWR(selectedLsaId ? `/get-audio-url?lsa_id=${selectedLsaId}` : null, fetcher);
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
            if(data && data.url) {            // Check if data and data.url exists
                console.log("url", data?.url);
                waveSurfer.load(data.url);
            }
        }

    }, [data]);

    const handlePlayPause = () => {
        if (wavesurferRef.current) {
            // @ts-ignore
            wavesurferRef.current.playPause();
            setIsPlaying(!isPlaying);
        }
    };

    useEffect(() => {
        if (wavesurferRef.current && data?.url) {
            // @ts-ignore
            wavesurferRef.current.load(data.url);
        }
    }, [data]);

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