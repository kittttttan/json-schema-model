export function substringBefore(src: string, search: string): string {
    const index = src.indexOf(search);
    if (index < 0) {
        return src;
    }

    return src.substring(0, index);
}
