import { TestBed } from '@angular/core/testing';
import { WebcamService } from './webcam.service';
import { configureTestSuite } from 'ng-bullet';

describe('WebcamService', () => {
  let service: WebcamService;

  configureTestSuite( () => {
    TestBed.configureTestingModule({
      providers: [WebcamService],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(WebcamService);
  });

  describe('isWebcamAllowed', () => {
    beforeEach(() => {
      window.MediaStream = jest.fn().mockImplementation(() => ({
        getTracks: jest.fn().mockReturnValue([])
      }));
    });

    it('should be false', (done) => {
      const mockMediaDevices = {
        getUserMedia: jest.fn().mockReturnValueOnce(null),
      };
      Object.defineProperty(window.navigator, 'mediaDevices', {
        writable: true,
        value: mockMediaDevices,
      });
      service.isWebcamAllowed().subscribe((isWebcamAllowed) => {
        expect(isWebcamAllowed).toBeFalsy();
        done();
      });
    });

    it('should be true', (done) => {
      const mockMediaDevices = {
        getUserMedia: jest.fn().mockResolvedValueOnce('fake data' as any),
      };
      Object.defineProperty(window.navigator, 'mediaDevices', {
        writable: true,
        value: mockMediaDevices,
      });
      service.isWebcamAllowed().subscribe((isWebcamAllowed) => {
        expect(isWebcamAllowed).toBeTruthy();
        done();
      });
    });
  });
});
