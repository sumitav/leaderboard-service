
export interface IScoreProducer<T> {
    addDataToQueue(newData: T): Promise<void>;
}