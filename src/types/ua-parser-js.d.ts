// types/ua-parser-js.d.ts
declare module 'ua-parser-js' {
    interface IUAParser {
        getResult: () => any;
        setUA: (userAgent: string) => void;
    }

    const UAParser: new () => IUAParser;

    export default UAParser;
}
