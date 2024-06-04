import UAParser from 'ua-parser-js';


export const detectDevice = () => {
    if (typeof window !== 'undefined') {
        const parser = new UAParser();
        parser.setUA(navigator.userAgent);
        const result = parser.getResult();
        return result.device.type === 'mobile' || result.device.type === 'tablet';
    }
    return false;
}