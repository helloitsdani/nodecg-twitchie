declare const guarantee: <T>(promiseFn: (...params: any[]) => Promise<T>, { timeBetweenRetries, logger }?: {
    timeBetweenRetries?: number | undefined;
    logger?: any;
}) => (...params: any[]) => () => void;
export default guarantee;
