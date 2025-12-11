import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as FormData from 'form-data';

@Injectable()
export class AIService {
    private readonly ollamaUrl = 'http://ollama:11434/api/chat';

    async process(fileBuffer: Buffer, fileType: string): Promise<any> {
        if (!fileType.startsWith('image/')) {
            throw new Error('Unsupported file type for AI processing');
        }

        const base64Image = fileBuffer.toString('base64');

        try {
            const response = await axios.post(
                this.ollamaUrl,
                {
                    model: 'llava-phi3:latest',
                    messages: [
                        { role: 'user', content: 'Describe the content of this image.' }
                    ],
                    images: [base64Image],
                },
                { timeout: 60000 }
            );

            return response.data.message?.content || response.data;
        } catch (error) {
            throw new Error(`AI processing failed: ${error.message}`);
        }
    }
}