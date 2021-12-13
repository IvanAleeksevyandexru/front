import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';

@Injectable()
export class DownloadService {
  /**
   * Скачивание файла
   */
  public downloadFile(value: string, type: string, fileName?: string): void {
    const isBase64 = type.includes(';base64');
    const data = isBase64 ? this.convertBase64(value) : value;
    // на мобилке не работает, если не обрезать тип
    const fileType = isBase64 ? type.replace(';base64', '') : type;
    const blob = new Blob([data], { type: fileType });

    saveAs(blob, fileName);
  }

  private convertBase64(value: string): Uint8Array {
    return new Uint8Array(
      atob(value)
        .split('')
        .map((char) => char.charCodeAt(0)),
    );
  }
}
