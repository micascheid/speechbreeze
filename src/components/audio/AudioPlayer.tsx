import {WaveSurfer, WaveForm} from "wavesurfer-react";
import {Card, Typography, Button, Skeleton, CircularProgress, Box} from "@mui/material";
import TimelinePlugin from "wavesurfer.js/plugins/timeline";
import {useSelectedLSA} from "@/contexts/SelectedLSAContext";
import useSWR from "swr";
import {fetcher} from "@/utils/axios";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";


export default function AudioPlayer() {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const {selectedLsaId, audioFileUrl} = useSelectedLSA();
    const {data, isLoading, error} = useSWR(selectedLsaId ? `/get-audio-url?lsa_id=${selectedLsaId}` : null, fetcher);
    const [isWavesurferLoaded, setIsWaversurferLoaded] = useState(false);
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
        if (wavesurferRef.current) {
            if (data && data.url) {            // Check if data and data.url exists
                console.log("url", data?.url);
                waveSurfer.load(data.url);
            }

            // @ts-ignore
            wavesurferRef.current.on("loading", () => {
                // console.log("loading");
            });

            // @ts-ignore
            wavesurferRef.current.on("ready", () => {

                setIsWaversurferLoaded(true);
            });
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
                cursorColor={"#000"}
                container={"#waveform"}
                cursorWidth={2}
            >
                <WaveForm id={"waveform"}>
                    {!isWavesurferLoaded && (
                        <CircularProgress sx={{m: 3}}/>
                    )}
                </WaveForm>
                <div id="timeline"/>
            </WaveSurfer>
            <Button variant={"outlined"} onClick={handlePlayPause}>{isPlaying ? "Pause" : "Play"}</Button>
        </Card>
    );
};