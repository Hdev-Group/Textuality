export default function readtimecalc({ text }: { text: any }) {
    const wordsPerMinute = 200;
    const noOfWords = text.split(/\s/g).length;
    const minutes = noOfWords / wordsPerMinute;
    const readTime = Math.ceil(minutes);

    if (readTime < 1) {
        return `${Math.ceil(minutes * 60)} seconds`;
    } else if (readTime === 1) {
        return `${readTime} minute`;
    } else if (readTime < 60) {
        return `${readTime} minutes`;
    } else {
        const hours = Math.floor(readTime / 60);
        const remainingMinutes = readTime % 60;
        return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes > 0 ? `and ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}` : ''}`;
    }
}