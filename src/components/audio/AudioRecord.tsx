import React, {ChangeEvent, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import { WaveSurfer, WaveForm } from 'wavesurfer-react';
import RecordPlugin from 'wavesurfer.js/plugins/record';
import { Button, Select, MenuItem, Stack, SelectChangeEvent, Box, Typography } from '@mui/material';
import TimelinePlugin from "wavesurfer.js/plugins/timeline";
import MainCard from '@/components/MainCard';
import MicrophonePlugin from 'wavesurfer.js/plugins/record';
import WarningModal from "@/components/WarningModal";
import {useTheme} from "@mui/material/styles";
import {useSelectedLSA} from "@/contexts/SelectedLSAContext"; // Assuming this is your custom component

interface DeviceInfo {
    deviceId: string;
    label: string;
}

function AudioRecord() {
    const [selectedDevice, setSelectedDevice] = useState<string>('');
    const [recordingTime, setRecordingTime] = useState(0);
    const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
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
    const { setLocalAudioSource } = useSelectedLSA();
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
        // Determine supported MIME type
        let supportedMimeType: string | null = 'audio/webm'; // Default to webm
        if (!MediaRecorder.isTypeSupported('audio/webm')) {
            if (MediaRecorder.isTypeSupported('audio/mp4')) {
                supportedMimeType = 'audio/mp4';
            } else {
                // Handle unsupported MIME types, fallback to another option or show an error
                console.error('No supported audio MIME type found.');
                supportedMimeType = null;
            }
        }

        // If no supported MIME type is found, do not include the record plugin
        const recordPlugin = supportedMimeType ? {
            key: "record",
            plugin: RecordPlugin,
            options: {
                audioBitsPerSecond: 128000,
                scrollingWaveform: false,
                mimeType: supportedMimeType,
                scrollingWaveformWindow: 20,
                renderMicStream: true,
            }
        } : null;

        const timelinePlugin = {
            key: "timeline",
            plugin: TimelinePlugin,
            options: {
                height: 20,
                style: {
                    color: '#6A3274'
                },
            }
        };

        return [recordPlugin, timelinePlugin].filter(Boolean);
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
                setLocalAudioSource(null);
            });

            recordPluginInstance.on('record-end', (blob: any) => {
                const url = URL.createObjectURL(blob);
                setRecordedBlobUrl(url);
                setLocalAudioSource(url);
            });

            waveSurfer.on('finish', () => {
                setIsPlaying(false);
            })
        }
    }, [setLocalAudioSource]);

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
        setLocalAudioSource(null);
        setIsRecording(true);
        recordingIntervalRef.current = setInterval(() => {
            setRecordingTime((prevTime) => prevTime + 1);
        }, 1000);
    };

    const stopRecording = () => {
        // @ts-ignore
        if (!wavesurferRef.current || !wavesurferRef.current.getActivePlugins().length) return;

        // @ts-ignore
        const recordPlugin = wavesurferRef.current.getActivePlugins()[0];
        recordPlugin.stopRecording();
        setIsRecording(false);
        if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
        setRecordingTime(0);
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
        setLocalAudioSource(null);
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

    const formatTime = (time: number) => {
        const mins = Math.floor(time / 60);
        const secs = time % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <MainCard>
            <Typography>Available Microphones</Typography>
            <Select value={selectedDevice} onChange={handleDeviceChange} sx={{minWidth: '150px'}} displayEmpty>
                {devices.map(device => (
                    <MenuItem key={device.deviceId} value={device.deviceId}>
                        {device.label}
                    </MenuItem>
                ))}
            </Select>
            {isRecording && (
                <Box>
                    <Typography variant="h6" color="error">Recording: {formatTime(recordingTime)}</Typography>
                </Box>
            )}
            <WaveSurfer
                onMount={handleWSMount}
                // @ts-ignore
                plugins={plugins}
                container="#waveform"
                {...waveformStylingProps}
            >
                <WaveForm id={"waveform"}/>
                {!isRecording && <div id="timeline"></div>}

            </WaveSurfer>
            <Stack spacing={1} alignItems="center">
                <Stack direction={"row"} spacing={1} sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    width: '100%',
                    '-webkit-overflow-scrolling': 'touch' // for momentum based scrolling in iOS
                }}>
                    <Button variant="outlined" onClick={isRecording ? stopRecording : startRecording}>
                        {isRecording ? "Stop" : "Record"}
                    </Button>
                    <Button variant="outlined" onClick={togglePlayPause} disabled={!recordedBlobUrl}
                            sx={{width: 75}}>{isPlaying ? "Pause" : "Play"}</Button>
                    <Button variant="outlined" disabled={!recordedBlobUrl} component="a" href={recordedBlobUrl || '#'}
                            download="recording.mp3" sx={{minWidth: '100px'}}>Download</Button>
                    <Button variant="outlined" disabled={!recordedBlobUrl} onClick={handleDiscardRecording}>Discard </Button>
                </Stack>


            </Stack>
            <WarningModal
                open={openWarning}
                warningMessage={warningMessage}
                handleClose={handleClose}
                handleContinue={handleContinue} />
        </MainCard>
    );
}

AudioRecord.displayName = 'AudioRecord';
export default AudioRecord;
