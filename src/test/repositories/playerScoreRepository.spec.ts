// playerScoreRepository.test.ts
import { PlayerScoreRepository } from '../../main/repositories/playerScore.repository';
import PlayerScore from '../../main/models/playerScore.model';
import logger from '../../main/config/logger';

jest.mock('../../main/models/playerScore.model', () => ({
    findOne: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    upsert: jest.fn()
}));

jest.mock('../../main/config/logger', () => ({
    info: jest.fn()
}));

const mockPlayerScore = {
    player_id: '1',
    score: 100,
} as unknown as PlayerScore;

describe('PlayerScoreRepository', () => {
    let repository: PlayerScoreRepository;

    beforeEach(() => {
        repository = new PlayerScoreRepository();
        jest.clearAllMocks();
    });

    describe('findById', () => {
        it('should find a player score by id and log the action', async () => {
            (PlayerScore.findOne as jest.Mock).mockResolvedValue(mockPlayerScore);

            const result = await repository.findById('1');

            expect(result).toEqual(mockPlayerScore);
            expect(logger.info).toHaveBeenCalledWith('Finding player score by id: ', '1');
        });
    });

    describe('findAll', () => {
        it('should find all player scores and log the action', async () => {
            (PlayerScore.findAll as jest.Mock).mockResolvedValue([mockPlayerScore]);

            const result = await repository.findAll();

            expect(result).toEqual([mockPlayerScore]);
            expect(logger.info).toHaveBeenCalledWith('Finding all player scores from the repository');
        });
    });

    describe('save', () => {
        it('should save a player score and log the action', async () => {
            (PlayerScore.create as jest.Mock).mockResolvedValue(mockPlayerScore);

            const result = await repository.save(mockPlayerScore);

            expect(result).toEqual(mockPlayerScore);
            expect(logger.info).toHaveBeenCalledWith('Saving player score: ', '1');
        });
    });

    describe('updateScore', () => {
        it('should update score if new score is greater and log the action', async () => {
            jest.spyOn(repository, 'findById').mockResolvedValue(mockPlayerScore);
            (PlayerScore.upsert as jest.Mock).mockResolvedValue([mockPlayerScore]);

            await repository.updateScore('1', 150);

            expect(PlayerScore.upsert).toHaveBeenCalledWith({ player_id: '1', score: 150 });
            expect(logger.info).toHaveBeenCalledWith('New Score updated successfully!!');
        });

        it('should not update score if new score is not greater and log the action', async () => {
            jest.spyOn(repository, 'findById').mockResolvedValue(mockPlayerScore);

            await repository.updateScore('1', 50);

            expect(PlayerScore.upsert).not.toHaveBeenCalled();
            expect(logger.info).toHaveBeenCalledWith('Player Id exists: New score is not greater than existing score');
        });
    });
});
