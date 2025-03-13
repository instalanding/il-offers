interface GradientResult {
    gradient: string;
    primaryColor: string;
    secondaryColor: string;
}

export default function createGradient(color: string): GradientResult {
    if (!/^#([0-9A-F]{3}){1,2}$/i.test(color)) {
        return {
            gradient: 'linear-gradient(180deg, rgb(192,192,192), white)',
            primaryColor: '#C0C0C0',
            secondaryColor: '#FFFFFF'
        };
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
    
    // Calculate a darker shade for secondary color (30% darker)
    const darkenColor = (hex: string): string => {
        const [r, g, b] = hexToRgb(hex);
        const darken = (value: number) => Math.max(0, Math.floor(value * 0.7));
        return `#${darken(r).toString(16).padStart(2, '0')}${darken(g).toString(16).padStart(2, '0')}${darken(b).toString(16).padStart(2, '0')}`;
    };
    
    return {
        gradient,
        primaryColor: color,
        secondaryColor: darkenColor(color)
    };
}