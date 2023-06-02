const prefix = ['', 'К', 'М', 'Г', 'Т', 'Р']

export const sizeToString = (size) => {
    let i = 0;
    for (; i < prefix.length; i++) {
        if (size < 1024) {
            break;
        }
        size = size >>> 10;
    }
    return `${size} ${prefix[i]}Б`;
}