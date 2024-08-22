// src/main/factories/CacheFactory.ts
import { ICache } from '../../interfaces/ICache.interface';
import PlayerScore from '../../models/playerScore.model';
import { InMemoryCacheService } from '../InMemoryCache.service';
import { RedisCacheService } from '../RedisCache.service';
import { Constants } from '../../constants/constants';
import { HighScoreStrategy } from '../strategy/HighScoreStrategy';


export class CacheFactory {
  static createCache(type: string): ICache<PlayerScore> {
    switch (type) {
      case Constants.CACHE_TYPE_IN_MEMORY:
        return new InMemoryCacheService(new HighScoreStrategy());
      case Constants.CACHE_TYPE_REDIS:
        return new RedisCacheService();
      default:
        throw new Error('Invalid cache type');
    }
  }
}