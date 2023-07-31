export default function decimalToRgb(int: number) {
    return {
        b: int & 0xff,
        g: (int >> 8) & 0xff,
        r: (int >> 16) & 0xff
    };
}