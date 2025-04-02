export const msToTime = (count: number): string => {
    const minutes = Math.floor(count / 60);
    const seconds = count % 60;
    const minStr = minutes <= 9 ? `0${minutes}` : `${minutes}`;
    const secondsStr = seconds <= 9 ? `0${seconds}` : `${seconds}`;
    return `${minStr}:${secondsStr}`;
}