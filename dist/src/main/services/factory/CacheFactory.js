"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheFactory = void 0;
const InMemoryCache_service_1 = require("../InMemoryCache.service");
const RedisCache_service_1 = require("../RedisCache.service");
const constants_1 = require("../../constants/constants");
const HighScoreStrategy_1 = require("../strategy/HighScoreStrategy");
class CacheFactory {
    static createCache(type) {
        switch (type) {
            case constants_1.Constants.CACHE_TYPE_IN_MEMORY:
                return new InMemoryCache_service_1.InMemoryCacheService(new HighScoreStrategy_1.HighScoreStrategy());
            case constants_1.Constants.CACHE_TYPE_REDIS:
                return new RedisCache_service_1.RedisCacheService();
            default:
                throw new Error('Invalid cache type');
        }
    }
}
exports.CacheFactory = CacheFactory;
//# sourceMappingURL=CacheFactory.js.map