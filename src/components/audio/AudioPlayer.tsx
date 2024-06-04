import {WaveSurfer, WaveForm} from "wavesurfer-react";
import {Card, Typography, Button, Skeleton, CircularProgress, Box} from "@mui/material";
import TimelinePlugin from "wavesurfer.js/plugins/timeline";
import {useSelectedLSA} from "@/contexts/SelectedLSAContext";
import useSWR from "swr";
import axios, {fetcher} from "@/utils/axios";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";


export default function AudioPlayer() {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const {selectedLsaId} = useSelectedLSA();
    const [isWavesurferLoaded, setIsWaversurferLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadError, setLoadError] = useState(false);
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
            // @ts-ignore
            wavesurferRef.current.on("loading", () => {
                console.log("loading");
            });

            // @ts-ignore
            wavesurferRef.current.on("ready", () => {
                setIsWaversurferLoaded(true);
            });
        }
    }, []);

    const handlePlayPause = () => {
        if (wavesurferRef.current) {
            // @ts-ignore
            wavesurferRef.current.playPause();
            setIsPlaying(!isPlaying);
        }
    };

    useEffect(() => {
        if (selectedLsaId) {
            setLoading(true);
            setLoadError(false);

            axios.get(`/get-audio-url?lsa_id=${selectedLsaId}`)
                .then(({ data }) => {
                    if (wavesurferRef.current) {
                        // @ts-ignore
                        wavesurferRef.current.load(data.url);
                    }
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching audio URL:", error);
                    setLoading(false);
                    setLoadError(true);
                });
        }
    }, [selectedLsaId]);


    return (
        <Box>
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
            </Card>
            <Button sx={{mt: 1}} disabled={loading} variant={"outlined"} onClick={handlePlayPause}>{isPlaying ? "Pause" : "Play"}</Button>
        </Box>

    );
};