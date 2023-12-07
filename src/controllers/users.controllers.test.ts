import { Request, Response, NextFunction } from 'express';
import { UsersController } from './users.controllers';
import { UserMongoRepo } from '../repos/users/users.mongo.repo.js';

describe('Given user controller class', () => {
  let controller: UsersController;
  let mockRequest: Request;
  let mockResponse: Response;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
      query: { key: 'value' },
    } as unknown as Request;
    mockResponse = {
      json: jest.fn(),
      status: jest.fn(),
    } as unknown as Response;
    mockNext = jest.fn();
  });

  describe('When we instantiate it without errors', () => {
    test('Then login should...', async () => {
      const mockUserId = 'mockUserId';
      const mockLoginResult = {
        id: 'mockUserId',
        email: 'mock@example.com',
      };
      const mockRequest = {
        body: { userId: mockUserId },
      } as unknown as Request;
      const mockRepo = {
        getById: jest.fn().mockResolvedValue(mockLoginResult),
        login: jest.fn().mockResolvedValue(mockLoginResult),
      } as unknown as UserMongoRepo;

      const controller = new UsersController(mockRepo);

      await controller.login(mockRequest, mockResponse, mockNext);
      expect(mockRepo.getById).toHaveBeenCalledWith(mockUserId);
    });
  });

  describe('When we instantiate it with errors', () => {
    let mockError: Error;
    beforeEach(() => {
      mockError = new Error('Mock error');
      const mockRepo = {
        login: jest.fn().mockRejectedValue(mockError),
      } as unknown as UserMongoRepo;

      controller = new UsersController(mockRepo);
    });
    test('Then login should throw an error', async () => {
      await controller.login(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });

    test('Then login should...', async () => {
      const mockTokenUserId = 'mockTokenUserId';
      const mockLoginResult = {
        id: 'mockTokenUserId',
        email: 'mock@example.com',
      };
      const mockRequest = {
        body: { userId: mockTokenUserId },
      } as unknown as Request;
      const mockRepo = {
        getById: jest.fn().mockResolvedValue(mockLoginResult),
        login: jest.fn().mockResolvedValue(mockLoginResult),
      } as unknown as UserMongoRepo;

      const controller = new UsersController(mockRepo);

      await controller.login(mockRequest, mockResponse, mockNext);
      // T expect(mockResponse.status).toHaveBeenCalledWith(202);
      // Texpect(mockResponse.statusMessage).toBe('Accepted');
      expect(mockRepo.getById).toHaveBeenCalledWith(mockTokenUserId);
    });
  });
});
