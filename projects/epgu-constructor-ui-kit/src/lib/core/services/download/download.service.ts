import { Injectable } from '@angular/core';
import { DeviceDetectorService } from '../device-detector/device-detector.service';

@Injectable()
export class DownloadService {
  constructor(private deviceDetector: DeviceDetectorService) {}
  /**
   * Скачивание файла
   */
  public downloadFile(value: string, type: string, fileName?: string): void {
    const isBase64 = type.includes(';base64');
    const data = isBase64 ? this.convertBase64(value) : value;
    // на мобилке не работает, если не обрезать тип
    const fileType = isBase64 ? type.replace(';base64', '') : type;
    const blob = new Blob([data], { type: fileType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.style.display = 'none';
    link.href = url;

    if (!this.deviceDetector.isWebView) {
      link.setAttribute('download', fileName || 'file');
    }

    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 200);
  }

  private convertBase64(value: string): Uint8Array {
    return new Uint8Array(
      atob(value)
        .split('')
        .map((char) => char.charCodeAt(0)),
    );
  }
}
