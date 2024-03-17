import React, {ChangeEvent, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import { WaveSurfer, WaveForm } from 'wavesurfer-react';
import RecordPlugin from 'wavesurfer.js/plugins/record';
import {Button, Select, MenuItem, Stack, SelectChangeEvent} from '@mui/material';
import TimelinePlugin from "wavesurfer.js/plugins/timeline";
import MainCard from '@/components/MainCard';
import RegionsPlugin from "wavesurfer.js/plugins/regions";
import WarningModal from "@/components/WarningModal";
import {useTheme} from "@mui/material/styles"; // Assuming this is your custom component

interface DeviceInfo {
    deviceId: string;
    label: string;
}

const AudioRecorder = () => {
    const [selectedDevice, setSelectedDevice] = useState<string>('');
    const [recordedBlobUrl, setRecordedBlobUrl] = useState<string | null>(null);
    const [devices, setDevices] = useState<DeviceInfo[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [openWarning, setOpenWarning] = useState(false);
    const [modalAction, setModalAction] = useState<'startRecording' | 'discardRecording' | null>(null);
    const [recordingState, setRecordingState] = useState<"stopped" | "recording" | "paused">("stopped");
    const [isRecording, setIsRecording] = useState(false);
    const wavesurferRef = useRef(null);
    const discardWarning = "Are you sure you want to discard your recording?\n IT WILL BE ERASED AND UNSAVED";
    const continueWarning = "You have an existing recording.\n Do you want to discard it and start a new recording?"
    const theme = useTheme();
    const warningMessage = modalAction === 'startRecording'
        ? `${continueWarning}`
        : `${discardWarning}`;
    const waveformStylingProps = {
        waveColor: theme.palette.secondary.main,
        progressColor: "#000",
        barGap: 1,
        barWidth: 2,
        cursorWidth: 2,
    }
    const plugins = useMemo(() => {
        return [
            {
                key: "record",
                plugin: RecordPlugin,
                options: {
                    audioBitsPerSecond: 128000,
                    scrollingWaveform: true,
                    mimeType: 'audio/webm',
                    scrollingWaveformWindow: 20,
                    renderRecordedAudio: true
                }
            },
            {
                key: "timeline",
                plugin: TimelinePlugin,
                options: {
                    height: 20,
                    style:
                        {
                            color: '#6A3274'
                        },
                }
            }
        ].filter(Boolean);
    }, []);

    const handleWSMount = useCallback((waveSurfer: any) => {
        wavesurferRef.current = waveSurfer;
        if (waveSurfer) {
            RecordPlugin.getAvailableAudioDevices().then((deviceList) => {
                const mappedDevices = deviceList.map(device => ({
                    deviceId: device.deviceId,
                    label: device.label || device.deviceId,
                }));
                setDevices(mappedDevices);
                if (mappedDevices.length > 0) {
                    setSelectedDevice(mappedDevices[0].deviceId);
                }
            });

            // @ts-ignore
            const recordPluginInstance = wavesurferRef.current?.getActivePlugins()[0];

            recordPluginInstance.on('record-start', (event: any) => {
                setRecordedBlobUrl(null);
            });

            recordPluginInstance.on('record-end', (blob: any) => {
                const url = URL.createObjectURL(blob);
                setRecordedBlobUrl(url);
            });
        }
    }, []);

    const startRecording = () => {
        if (recordedBlobUrl !== null) {
            setModalAction('startRecording');
            handleOpen();
        } else {
            executeRecording();
        }
    };


    const executeRecording = () => {
        // @ts-ignore
        if (!wavesurferRef.current || !wavesurferRef.current.getActivePlugins().length) return;

        // @ts-ignore
        const recordPlugin = wavesurferRef.current.getActivePlugins()[0];
        recordPlugin.startRecording();
        setRecordedBlobUrl(null);
        setIsRecording(true);
    };

    const stopRecording = () => {
        // @ts-ignore
        if (!wavesurferRef.current || !wavesurferRef.current.getActivePlugins().length) return;

        // @ts-ignore
        const recordPlugin = wavesurferRef.current.getActivePlugins()[0];
        recordPlugin.stopRecording();
        setIsRecording(false);
    };


    const togglePlayPause = () => {
        if (wavesurferRef.current) {
            // @ts-ignore
            wavesurferRef.current.playPause(); // Toggles playback
            setIsPlaying(!isPlaying); // Updates the playback state
        }
    };

    const handleDiscardRecording = () => {
        setModalAction('discardRecording');
        handleOpen();
    }


    const discardRecording = () => {
        setRecordedBlobUrl(null);
        if (wavesurferRef.current) {
            // @ts-ignore
            wavesurferRef.current.empty();
        }
    };

    const handleDeviceChange = (event: SelectChangeEvent<string>) => {
        setSelectedDevice(event.target.value);
    };

    // Warning Modal Functions
    const handleOpen = () => {
        setOpenWarning(true);
    }

    const handleClose = () => {
        setOpenWarning(false);
    };

    const handleContinue = () => {
        if (modalAction === 'startRecording') {
            discardRecording();
            executeRecording();
        } else if (modalAction === 'discardRecording') {
            discardRecording();
        }
        setOpenWarning(false);
        setModalAction(null);
    };

    return (
        <MainCard>
            <WaveSurfer
                onMount={handleWSMount}
                // @ts-ignore
                plugins={plugins}
                container="#waveform"
                {...waveformStylingProps}
            >
                <WaveForm id={"waveform"}/>
                <div id="timeline"></div>
            </WaveSurfer>
            <Stack direction="row" spacing={1}>
                <Select value={selectedDevice} onChange={handleDeviceChange} displayEmpty>
                    {devices.map(device => (
                        <MenuItem key={device.deviceId} value={device.deviceId}>
                            {device.label}
                        </MenuItem>
                    ))}
                </Select>
                <Button variant="outlined" onClick={isRecording ? stopRecording : startRecording}>
                    {isRecording ? "Stop Recording" : "Start Recording"}
                </Button>
                <Button variant="outlined" onClick={togglePlayPause} disabled={!recordedBlobUrl}
                        sx={{width: 75}}>{isPlaying ? "Pause" : "Play"}</Button>
                <Button variant="outlined" disabled={!recordedBlobUrl} component="a" href={recordedBlobUrl || '#'}
                        download="recording.mp3">Save</Button>
                <Button variant="outlined" disabled={!recordedBlobUrl} onClick={handleDiscardRecording}>Discard </Button>

            </Stack>
            <WarningModal
                open={openWarning}
                warningMessage={warningMessage}
                handleClose={handleClose}
                handleContinue={handleContinue} />
        </MainCard>
    );
};

export default AudioRecorder;
