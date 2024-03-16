
import 'wavesurfer.js';
import { GenericPlugin } from 'wavesurfer.js/dist/base-plugin.js';

declare module 'wavesurfer.js' {
    interface WaveSurfer {
        getPlugin(name: string): GenericPlugin | undefined;
    }
}
