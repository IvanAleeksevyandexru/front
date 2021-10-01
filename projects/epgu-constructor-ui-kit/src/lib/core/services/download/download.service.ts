import { Injectable } from '@angular/core';
import { DeviceDetectorService } from '../device-detector/device-detector.service';

@Injectable()
export class DownloadService {
  constructor(private deviceDetector: DeviceDetectorService) {}
  /**
   * Скачивание файла
   */
  public downloadFile({ value, type }: { value: string; type: string }): void {
    const blob = new Blob([value], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.style.display = 'none';
    link.href = url;

    if (!this.deviceDetector.isWebView) {
      link.setAttribute('download', 'file');
    }

    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 200);
  }
}
