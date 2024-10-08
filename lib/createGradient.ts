export default function createGradient(color: string) {
    if (!/^#([0-9A-F]{3}){1,2}$/i.test(color)) {
        return 'linear-gradient(180deg, rgb(192,192,192), white)'
    }
    const hexToRgb = (hex: string) => {
        let c = hex.substring(1).split('');
        if (c.length === 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        const cNumber = parseInt(c.join(''), 16);
        return [(cNumber >> 16) & 255, (cNumber >> 8) & 255, cNumber & 255];
    };
    const [r, g, b] = hexToRgb(color);
    const rgbaColor = `rgba(${r}, ${g}, ${b}, 0.5)`;
    const gradient = `linear-gradient(180deg, ${rgbaColor}, white)`;
    return gradient;
}