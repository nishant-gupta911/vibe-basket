export interface EmbeddingResult {
    embedding: number[];
    text: string;
}
export declare const embeddingService: {
    generateEmbedding(text: string): Promise<number[]>;
    generateBatchEmbeddings(texts: string[]): Promise<EmbeddingResult[]>;
    cosineSimilarity(a: number[], b: number[]): number;
};
