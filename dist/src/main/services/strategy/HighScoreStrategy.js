"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HighScoreStrategy = void 0;
class HighScoreStrategy {
    sort(players) {
        return players.sort((a, b) => b.score - a.score);
    }
}
exports.HighScoreStrategy = HighScoreStrategy;
//# sourceMappingURL=HighScoreStrategy.js.map