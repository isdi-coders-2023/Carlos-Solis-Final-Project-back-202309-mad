import { HttpError } from '../types/http.error';
import { MediaFiles } from './media.file';

// Can instantiate MediaFiles class without errors
it('should instantiate MediaFiles class without errors', () => {
  // Arrange
  // Act
  const mediaFiles = new MediaFiles();

  // Assert
  expect(mediaFiles).toBeInstanceOf(MediaFiles);
});
// HttpError contains expected properties (status, statusMessage, message)
it('should HttpError contain expected properties (status, statusMessage, message)', () => {
  // Arrange
  const status = 406;
  const statusMessage = 'Not Acceptable';
  const message = 'Upload failed';

  // Act
  const httpError = new HttpError(status, statusMessage, message);

  // Assert
  expect(httpError.status).toBe(status);
  expect(httpError.statusMessage).toBe(statusMessage);
  expect(httpError.message).toBe(message);
});
