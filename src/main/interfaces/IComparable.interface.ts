// src/leaderboard/strategy/IComparable.ts

import PlayerScore from '../models/playerScore.model';

export interface IComparable {
    compare(score1:  PlayerScore, score2:  PlayerScore): number;
}