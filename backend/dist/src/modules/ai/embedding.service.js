"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.embeddingService = void 0;
const openai_1 = __importDefault(require("openai"));
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
exports.embeddingService = {
    async generateEmbedding(text) {
        try {
            const response = await openai.embeddings.create({
                model: process.env.EMBEDDING_MODEL || 'text-embedding-3-small',
                input: text,
            });
            return response.data[0].embedding;
        }
        catch (error) {
            console.error('Error generating embedding:', error);
            if (error.status === 401) {
                throw new Error('OpenAI API key is invalid');
            }
            if (error.status === 429) {
                throw new Error('OpenAI API quota exceeded. Please add credits to your account.');
            }
            throw new Error('Failed to generate embedding');
        }
    },
    async generateBatchEmbeddings(texts) {
        try {
            const response = await openai.embeddings.create({
                model: process.env.EMBEDDING_MODEL || 'text-embedding-3-small',
                input: texts,
            });
            return response.data.map((item, index) => ({
                embedding: item.embedding,
                text: texts[index],
            }));
        }
        catch (error) {
            console.error('Error generating batch embeddings:', error);
            throw new Error('Failed to generate batch embeddings');
        }
    },
    cosineSimilarity(a, b) {
        if (a.length !== b.length) {
            throw new Error('Vectors must have the same length');
        }
        const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
        const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
        const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
        if (magnitudeA === 0 || magnitudeB === 0) {
            return 0;
        }
        return dotProduct / (magnitudeA * magnitudeB);
    },
};
//# sourceMappingURL=embedding.service.js.map