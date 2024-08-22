export interface ICache<T> {
  initialize(topN: number, data: T[]): Promise<void>;
  addToCache(data: T): Promise<void>;
  getTopNPlayers(): T[]| Promise<T[]>;
  getScoreByPlayerId(playerId: string): T | Promise<T | undefined>;
}