export function imageToAscii(imageData, width, height, chars, options = {}) {
    const { contrast = 1.8, brightness = -20 } = options;
    const ascii = [];
    const data = imageData.data;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;

            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];

            // Perceptual luminance
            let luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b);
            
            // High contrast boost for the "Sharp" look
            luminance = ((luminance - 128) * contrast) + 128 + brightness;
            
            // Clamp and map
            const clamped = Math.max(0, Math.min(255, luminance));
            const charIndex = Math.floor((clamped / 255) * (chars.length - 1));
            ascii.push(chars[charIndex]);
        }
        ascii.push("\n");
    }

    return ascii.join('');
}