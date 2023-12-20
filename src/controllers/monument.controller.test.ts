import { NextFunction, Request, Response } from 'express';
import { MonumentController } from './monument.controller';
import { MonumentsMongoRepo } from '../repos/monuments/monuments.mongo.repo.js';
import { Monument } from '../entities/monument.model';

describe('Given MonumentsController Class...', () => {
  beforeEach(() => {
    const mockRepo = {
      create: jest.fn().mockResolvedValue({}),
      getById: jest.fn().mockResolvedValue({}),
      getAll: jest.fn().mockResolvedValue({}),
      delete: jest.fn().mockResolvedValue({}),
      update: jest.fn().mockResolvedValue({}),
    } as unknown as MonumentsMongoRepo;
    controller = new MonumentController(mockRepo);
  });

  let controller: MonumentController;
  let mockRequest: Request;

  let mockResponse: Response;
  let mockNext: NextFunction;

  beforeAll(() => {
    mockRequest = {
      body: {},
      params: {},
    } as unknown as Request;

    mockResponse = {
      json: jest.fn(),
      status: jest.fn(),
    } as unknown as Response;
    mockNext = jest.fn();
  });

  describe('When we create a new monument', () => {
    test('Then the create method should create a new monument with the proper info and the right image...', async () => {
      const mockRequest = {
        file: {
          path: 'valid/path/to/image.jpg',
        },
        body: {},
      } as unknown as Request;

      const mockNext = jest.fn();
      const mockRepo = {
        create: jest.fn(),
      } as unknown as MonumentsMongoRepo;
      const controller = new MonumentController(mockRepo);
      const mockImageData = { url: 'https://example.com/image.jpg' };
      const mockCloudinaryService = {
        uploadImage: jest.fn().mockResolvedValue(mockImageData),
      };

      controller.cloudinaryService = mockCloudinaryService;
      await controller.create(mockRequest, mockResponse, mockNext);
      expect(mockCloudinaryService.uploadImage).toHaveBeenCalledWith(
        mockRequest.file?.path
      );
      expect(mockRequest.body.picture).toBe(mockImageData);
    });

    test('Then delete should...', async () => {
      await controller.delete(mockRequest, mockResponse, mockNext);
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.statusMessage).toBe('No Content');
      expect(mockResponse.json).toHaveBeenCalledWith({});
    });
  });

  describe('When we instantiate it with errors', () => {
    let mockError: Error;
    beforeEach(() => {
      mockError = new Error('Invalid multer file');
      const mockRepo = {
        create: jest.fn().mockRejectedValue(mockError),
        delete: jest.fn().mockRejectedValue(mockError),
        update: jest.fn().mockRejectedValue(mockError),
      } as unknown as MonumentsMongoRepo;
      controller = new MonumentController(mockRepo);
    });

    test('Then create should throw an error', async () => {
      await controller.create(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });

    test('Then update should throw an error', async () => {
      await controller.update(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });

    test('Then delete should ...', async () => {
      await controller.delete(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe('Given MonumentssController Class...', () => {
    const mockMonument = {} as unknown as Monument;

    const mockRepo = {
      update: jest.fn().mockResolvedValue(mockMonument),
    } as unknown as MonumentsMongoRepo;

    const mockRequest = {
      body: { author: { id: '1' }, userId: '1' },
      params: { id: '1' },
    } as unknown as Request;

    const mockResponse = {
      json: jest.fn(),
      status: jest.fn(),
    } as unknown as Response;
    const mockNext = jest.fn() as NextFunction;

    controller = new MonumentController(mockRepo);

    describe('When we update an existing monument', () => {
      test('Then the update method should update the monument with the provided information', async () => {
        const mockUpdatedMonument = {};

        await controller.update(mockRequest, mockResponse, mockNext);
        MonumentsMongoRepo.prototype.update = mockRepo.update;
        expect(mockResponse.json).toHaveBeenCalledWith(mockUpdatedMonument);
      });
    });

    describe('When we create a new monument', () => {
      test('Then the create method should create a new monument with the proper info and the right image...', async () => {
        const mockRequestWithFile = {
          file: {
            path: 'valid/path/to/image.jpg',
          },
          body: {},
        } as unknown as Request;

        const mockImageData = { url: 'https://example.com/image.jpg' };
        const mockCloudinaryService = {
          uploadImage: jest.fn().mockResolvedValue(mockImageData),
        };

        controller.cloudinaryService = mockCloudinaryService;

        await controller.create(mockRequestWithFile, mockResponse, mockNext);
        expect(mockCloudinaryService.uploadImage).toHaveBeenCalledWith(
          mockRequestWithFile.file?.path
        );
        expect(mockRequestWithFile.body.picture).toBe(mockImageData);
      });
    });
  });
});
