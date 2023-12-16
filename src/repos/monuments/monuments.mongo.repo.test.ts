import { UserModel } from '../users/users.mongo.model.js';
// Import { UserMongoRepo } from '../users/users.mongo.repo.js';
import { monumentModel } from './monuments.mongo.model.js';
import { MonumentsMongoRepo } from './monuments.mongo.repo.js';

jest.mock('../monuments/monuments.mongo.model.js');
jest.mock('../users/users.mongo.repo.js');
jest.mock('../users/users.mongo.model.js');
describe('Given the class MonumentMongoRepo', () => {
  let repo: MonumentsMongoRepo;
  // Const exec = jest.fn().mockResolvedValue('Test');

  describe('When it is instantiated and its methods are called', () => {
    const exec = jest.fn().mockResolvedValue('Test');
    beforeEach(() => {
      repo = new MonumentsMongoRepo();
      monumentModel.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });

      monumentModel.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });
      monumentModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });
      monumentModel.findByIdAndDelete = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });

      monumentModel.create = jest.fn().mockReturnValue({});
    });
    test('Then it should execute getById', async () => {
      const result = await repo.getById('');
      expect(exec).toHaveBeenCalled();
      expect(result).toBe('Test');
    });

    test('Then it should execute update', async () => {
      const result = await repo.update('', { id: '' });
      expect(exec).toHaveBeenCalled();
      expect(result).toBe('Test');
    });

    test('Then it should execute getAll', async () => {
      const result = await repo.getAll();
      expect(exec).toHaveBeenCalled();
      expect(result).toBe('Test');
    });

    test('Then should delete the recipe and remove it from the author list', async () => {
      const id = 'testId';
      const exec = jest.fn().mockResolvedValue({});
      monumentModel.findByIdAndDelete = jest.fn().mockReturnValue({
        exec,
      });

      UserModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec,
      });
      await repo.delete(id);

      expect(monumentModel.findByIdAndDelete).toHaveBeenCalledWith(id);
      expect(UserModel.findByIdAndUpdate).toHaveBeenCalled();
    });
  });

  describe('When we isntantiate it WITH errors', () => {
    const exec = jest.fn().mockResolvedValue(null);
    beforeEach(() => {
      monumentModel.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });
      monumentModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });
      monumentModel.findByIdAndDelete = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });
      repo = new MonumentsMongoRepo();
    });

    test('Then getById should throw an error', async () => {
      expect(repo.getById('')).rejects.toThrow();
    });
    test('Then update should throw an error', async () => {
      expect(repo.update('', { id: '' })).rejects.toThrow();
    });
    test('Then should throw an error if the recipe does not exist', async () => {
      const id = 'testId';
      monumentModel.findByIdAndDelete = jest.fn().mockReturnValue({
        exec,
      });

      await expect(repo.delete(id)).rejects.toThrow();
    });
  });
});
