export interface HttpOutboxPayload {
    method: 'POST' | 'PUT' | 'PATCH';
    url: string;

    headers?: Record<string, string>;

    // multipart support
    file?: {
        bufferBase64: string;
        filename: string;
        mimeType: string;
    };

    body?: Record<string, any>; // normal fields
}
