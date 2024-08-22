// src/main/services/RedisCache.service.ts
import { ICache } from '../interfaces/ICache.interface';
import PlayerScore from '../models/playerScore.model';

export class RedisCacheService implements ICache<PlayerScore> {
    initialize(topN: number, data: PlayerScore[]): Promise<void> {
        throw new Error('Method not implemented.');
    }
    addToCache(data: PlayerScore): Promise<void> {
        throw new Error('Method not implemented.');
    }
    getTopNPlayers(): PlayerScore[] {
        throw new Error('Method not implemented.');
    }
    getScoreByPlayerId(playerId: string): PlayerScore {
        throw new Error('Method not implemented.');
    }
}