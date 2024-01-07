const encoder = new TextEncoder();

export function toBase64(text: string): string {
    const bytes = encoder.encode(text);
    const binString = String.fromCodePoint(...bytes);
    return btoa(binString);
}

export function toBase64EncodeURI(text: string): string {
    return encodeURIComponent(toBase64(text));
}