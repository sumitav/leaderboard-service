export interface IScoreConsumer<T> {
    consumeDataFromQueue(newData: T): void;
}