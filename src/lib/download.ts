
/**
 * Triggers a browser download for the given data.
 * @param data The string data to download.
 * @param filename The desired filename for the download.
 * @param mimeType The MIME type of the file (e.g., 'application/json', 'text/csv').
 */
export function downloadFile(data: string, filename: string, mimeType: string): void {
    // Create a Blob from the data
    const blob = new Blob([data], { type: mimeType });

    // Create an object URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;

    // Append the anchor to the body, click it, and then remove it
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Revoke the object URL to free up memory
    URL.revokeObjectURL(url);
}
