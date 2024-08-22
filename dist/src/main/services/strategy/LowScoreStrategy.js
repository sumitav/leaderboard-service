"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LowScoreStrategy = void 0;
class LowScoreStrategy {
    sort(players) {
        return players.sort((a, b) => a.score - b.score);
    }
}
exports.LowScoreStrategy = LowScoreStrategy;
//# sourceMappingURL=LowScoreStrategy.js.map