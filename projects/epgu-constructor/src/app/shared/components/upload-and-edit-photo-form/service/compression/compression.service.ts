import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

export interface CompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  maxIteration?: number;
  exifOrientation?: number;
  fileType?: string;
  customFileName?: string;
  deepChecking?: boolean;
}

const unsupportedImageTypes = ['TIFF', 'TIF'];

@Injectable()
export class CompressionService {
  isValidImageType(file: File | Blob): boolean {
    const hasImageType = /^image/.test(file?.type);

    const unsupportedTypesRegexp = new RegExp(unsupportedImageTypes.join('|'), 'i');
    const hasSupportedType = !unsupportedTypesRegexp.test(file?.type);

    return hasImageType && hasSupportedType;
  }

  /**
   * @param {File} file
   * @param {Object} options - { maxSizeMB=Number.POSITIVE_INFINITY, maxWidthOrHeight, maxIteration = 10, exifOrientation, fileType }
   * @param {number} [options.maxSizeMB=Number.POSITIVE_INFINITY]
   * @param {number} [options.maxWidthOrHeight=undefined]
   * @param {number} [options.maxIteration=10]
   * @param {number} [options.exifOrientation]
   * @param {string} [options.fileType]
   * @returns {Promise<File | Blob>}
   */
  public async imageCompression(
    file: File | Blob,
    options: CompressionOptions,
  ): Promise<File | Blob> {
    let compressedFile: File | Blob;

    if (!(file instanceof Blob)) {
      throw new Error('The file given is not an instance of Blob or File');
    } else if (!(await this.isValidImage(file, options.deepChecking))) {
      throw new Error('The file given is not a valid image');
    }

    compressedFile = await this.compress(file, options);

    try {
      compressedFile['name'] = options?.customFileName || file['name'];
      compressedFile['lastModified'] = file['lastModified'];
    } catch (e) {}

    return compressedFile;
  }

  /**
   * @returns {boolean}
   */
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  /**
   * @returns {Promise<boolean>}
   */
  private async isAutoOrientationInBrowser(): Promise<boolean> {
    const testImageURL =
      'data:image/jpeg;base64,/9j/4QAiRXhpZgAATU0AKgAAAAgAAQESAAMAAAABAAYAAAA' +
      'AAAD/2wCEAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBA' +
      'QEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQE' +
      'BAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAf/AABEIAAEAAgMBEQACEQEDEQH/x' +
      'ABKAAEAAAAAAAAAAAAAAAAAAAALEAEAAAAAAAAAAAAAAAAAAAAAAQEAAAAAAAAAAAAAAAA' +
      'AAAAAEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8H//2Q==';
    const testImageFile: File | Blob = await this.getFilefromDataUrl(
      testImageURL,
      'image.jpg',
      Date.now(),
    );
    const testImageCanvas = (await this.drawFileInCanvas(testImageFile))[1];
    const testImageFile2 = await this.canvasToFile(
      testImageCanvas,
      testImageFile['type'],
      testImageFile['name'],
      testImageFile['lastModified'],
    );

    this.cleanupCanvasMemory(testImageCanvas);

    const testImageURL2 = await this.getDataUrlFromFile(testImageFile2);
    const img = await this.loadImage(testImageURL2);

    return img.width === 1 && img.height === 2;
  }

  /**
   * @param {File | Blob} file
   * @returns {Promise<string>}
   */
  private getDataUrlFromFile(file: File | Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (): void => resolve(reader.result as string);
      reader.onerror = (e): void => reject(e);
      reader.readAsDataURL(file);
    });
  }

  /**
   * @param {string} dataUrl
   * @param {string} filename
   * @param {number} [lastModified=Date.now()]
   * @returns {Promise<File | Blob>}
   */
  private getFilefromDataUrl(
    dataUrl: string,
    filename: string,
    lastModified: number = Date.now(),
  ): Promise<File | Blob> {
    return new Promise((resolve) => {
      const arr = dataUrl.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = window.atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const file = new Blob([u8arr], { type: mime });
      file['name'] = filename;
      file['lastModified'] = lastModified;
      resolve(file);
    });
  }

  /**
   * @param {string} src
   * @returns {Promise<HTMLImageElement>}
   */
  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = (): void => resolve(img);
      img.onerror = (e): void => reject(e);
      img.src = src;
    });
  }

  /**
   * @param {HTMLImageElement} img
   * @returns {HTMLCanvasElement | OffscreenCanvas}
   */
  private drawImageInCanvas(
    img: HTMLImageElement,
    width?: number,
    height?: number,
  ): HTMLCanvasElement | OffscreenCanvas {
    const [canvas, ctx] = this.getNewCanvasAndCtx(width || img['width'], height || img['height']);
    ctx.drawImage(img, 0, 0, canvas['width'], canvas['height']);
    return canvas;
  }

  private async createImageBitmap(data: Blob | ImageData): Promise<void | HTMLImageElement> {
    return new Promise((resolve) => {
      let dataURL;
      if (data instanceof Blob) {
        dataURL = URL.createObjectURL(data);
      } else if (data instanceof ImageData) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas['width'] = data['width'];
        canvas['height'] = data['height'];
        ctx.putImageData(data, 0, 0);
        dataURL = canvas.toDataURL();
        this.cleanupCanvasMemory(canvas);
      } else {
        throw new Error('createImageBitmap does not handle the provided image source type');
      }
      const img = document.createElement('img');
      img.addEventListener('load', function () {
        resolve(this);
      });
      img.src = dataURL;
    });
  }

  private async getImageBitmap(file: File | Blob): Promise<ImageBitmap | HTMLImageElement> {
    let img;
    try {
      img = await this.createImageBitmap(file);
    } catch (e) {
      const dataUrl = await this.getDataUrlFromFile(file);
      img = await this.loadImage(dataUrl as string);
    }

    return img;
  }

  /**
   * @param {File | Blob} file
   * @returns {Promise<[ImageBitmap | HTMLImageElement, HTMLCanvasElement | OffscreenCanvas]>}
   */
  private async drawFileInCanvas(
    file: File | Blob,
    width?: number,
    height?: number,
  ): Promise<[ImageBitmap | HTMLImageElement, HTMLCanvasElement | OffscreenCanvas]> {
    const img = await this.getImageBitmap(file);
    const canvas = this.drawImageInCanvas(img as HTMLImageElement, width, height);
    return [img, canvas];
  }

  /**
   * @param {any} canvas
   * @param {string} fileType
   * @param {string} fileName
   * @param {number} fileLastModified
   * @param {number} [quality] = 1
   * @returns {Promise<File | Blob>}
   */
  private async canvasToFile(
    canvas: HTMLCanvasElement | OffscreenCanvas,
    fileType: string,
    fileName: string,
    fileLastModified: number,
    quality: number = 1,
  ): Promise<File | Blob> {
    let file;
    if (typeof OffscreenCanvas === 'function' && canvas instanceof OffscreenCanvas) {
      file = await canvas.convertToBlob({ type: fileType, quality });
      file['name'] = fileName;
      file['lastModified'] = fileLastModified;
    } else {
      const dataUrl = (canvas as HTMLCanvasElement).toDataURL(fileType, quality);
      file = await this.getFilefromDataUrl(dataUrl, fileName, fileLastModified);
    }
    return file;
  }

  /**
   * @param {File | Blob} file
   * @returns {Promise<number>}
   * see: https://stackoverflow.com/questions/7584794/accessing-jpeg-exif-rotation-data-in-javascript-on-the-client-side/32490603#32490603
   */
  private getExifOrientation(file: File | Blob): Promise<number> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e): void => {
        const view = new DataView(e.target.result as ArrayBuffer);
        if (view.getUint16(0, false) != 0xffd8) {
          return resolve(-2);
        }
        const length = view.byteLength;
        let offset = 2;
        while (offset < length) {
          if (view.getUint16(offset + 2, false) <= 8) return resolve(-1);
          const marker = view.getUint16(offset, false);
          offset += 2;
          if (marker == 0xffe1) {
            if (view.getUint32((offset += 2), false) != 0x45786966) {
              return resolve(-1);
            }

            const little = view.getUint16((offset += 6), false) == 0x4949;
            offset += view.getUint32(offset + 4, little);
            const tags = view.getUint16(offset, little);
            offset += 2;
            for (let i = 0; i < tags; i++) {
              if (view.getUint16(offset + i * 12, little) == 0x0112) {
                return resolve(view.getUint16(offset + i * 12 + 8, little));
              }
            }
          } else if ((marker & 0xff00) != 0xff00) {
            break;
          } else {
            offset += view.getUint16(offset, false);
          }
        }
        return resolve(-1);
      };
      reader.onerror = (e): void => reject(e);
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * @param {HTMLCanvasElement | OffscreenCanvas} canvas
   * @param options
   * @returns {HTMLCanvasElement | OffscreenCanvas}
   */
  private async handleMaxWidthOrHeight(
    file: File | Blob,
    options: CompressionOptions,
  ): Promise<HTMLCanvasElement | OffscreenCanvas> {
    const img = await this.getImageBitmap(file);
    const maxWidthOrHeight = options['maxWidthOrHeight'];
    const width = img['width'];
    const height = img['height'];

    const needToHandle =
      isFinite(maxWidthOrHeight) && (width > maxWidthOrHeight || height > maxWidthOrHeight);

    let newWidth = width;
    let newHeight = height;

    if (needToHandle) {
      if (newWidth > newHeight) {
        newWidth = maxWidthOrHeight;
        newHeight = (newHeight / width) * maxWidthOrHeight;
      } else {
        newWidth = (newWidth / height) * maxWidthOrHeight;
        newHeight = maxWidthOrHeight;
      }
    }

    const [, canvas] = await this.drawFileInCanvas(file, newWidth, newHeight);

    return canvas;
  }

  /**
   * @param {HTMLCanvasElement | OffscreenCanvas} canvas
   * @param {number} exifOrientation
   * @returns {HTMLCanvasElement | OffscreenCanvas}
   */
  private followExifOrientation(
    canvas: HTMLCanvasElement | OffscreenCanvas,
    exifOrientation: number,
  ): HTMLCanvasElement | OffscreenCanvas {
    const width = canvas['width'];
    const height = canvas['height'];

    const [newCanvas, ctx] = this.getNewCanvasAndCtx(width, height);

    if (4 < exifOrientation && exifOrientation < 9) {
      newCanvas['width'] = height;
      newCanvas['height'] = width;
    } else {
      newCanvas['width'] = width;
      newCanvas['height'] = height;
    }

    switch (exifOrientation) {
      case 2:
        ctx.transform(-1, 0, 0, 1, width, 0);
        break;
      case 3:
        ctx.transform(-1, 0, 0, -1, width, height);
        break;
      case 4:
        ctx.transform(1, 0, 0, -1, 0, height);
        break;
      case 5:
        ctx.transform(0, 1, 1, 0, 0, 0);
        break;
      case 6:
        ctx.transform(0, 1, -1, 0, height, 0);
        break;
      case 7:
        ctx.transform(0, -1, -1, 0, height, width);
        break;
      case 8:
        ctx.transform(0, -1, 1, 0, 0, width);
        break;
      default:
        break;
    }

    ctx.drawImage(canvas, 0, 0, width, height);
    this.cleanupCanvasMemory(canvas);

    return newCanvas;
  }

  /**
   * @param {number} width
   * @param {number} height
   * @returns {[HTMLCanvasElement | OffscreenCanvas, CanvasRenderingContext2D]}
   */
  private getNewCanvasAndCtx(
    width: number,
    height: number,
  ): [HTMLCanvasElement | OffscreenCanvas, CanvasRenderingContext2D] {
    let canvas;
    let ctx;
    try {
      canvas = new OffscreenCanvas(width, height) as OffscreenCanvas;
      ctx = canvas.getContext('2d');
      if (ctx === null) {
        throw new Error('getContext of OffscreenCanvas returns null');
      }
    } catch (e) {
      canvas = document.createElement('canvas') as HTMLCanvasElement;
      canvas['id'] = uuidv4();
      ctx = canvas.getContext('2d');
    }
    canvas['width'] = width;
    canvas['height'] = height;
    return [canvas, ctx];
  }

  /**
   * @param {HTMLCanvasElement | OffscreenCanvas} canvas
   * @returns void
   */
  private cleanupCanvasMemory(canvas: HTMLCanvasElement | OffscreenCanvas): void {
    canvas['width'] = 0;
    canvas['height'] = 0;
  }

  private async isValidImage(file: File | Blob, deepChecking?: boolean): Promise<boolean> {
    const isValidImageType = this.isValidImageType(file);

    if (!isValidImageType) {
      return false;
    } else if (isValidImageType && !deepChecking) {
      return true;
    } else {
      return await this.addImageProcess(file);
    }
  }

  private addImageProcess(file: File | Blob): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const objUrl = URL.createObjectURL(file);
      let img = new Image();

      img.onload = (): void => {
        URL.revokeObjectURL(objUrl);
        return resolve(true);
      };
      img.onerror = (): void => {
        URL.revokeObjectURL(objUrl);
        return reject(false);
      };

      img.src = objUrl;
    });
  }

  /**
   * @param {File} file
   * @param {Object} options -{ maxSizeMB=Number.POSITIVE_INFINITY, maxWidthOrHeight, maxIteration = 10, exifOrientation, fileType }
   * @param {number} [options.maxSizeMB=Number.POSITIVE_INFINITY]
   * @param {number} [options.maxWidthOrHeight=undefined]
   * @param {number} [options.maxIteration=10]
   * @param {number} [options.exifOrientation]
   * @param {string} [options.fileType]
   * @returns {Promise<File | Blob>}
   */
  private async compress(file: File | Blob, options: CompressionOptions): Promise<File | Blob> {
    let remainingTrials = options['maxIteration'] || 10;
    const maxSizeByte = options['maxSizeMB'] * 1024 * 1024;

    const maxWidthOrHeightFixedCanvas = await this.handleMaxWidthOrHeight(file, options);

    options['exifOrientation'] =
      options['exifOrientation'] || (await this.getExifOrientation(file));

    const orientationFixedCanvas =
      (await this.isAutoOrientationInBrowser()) && this.isBrowser()
        ? maxWidthOrHeightFixedCanvas
        : this.followExifOrientation(maxWidthOrHeightFixedCanvas, options['exifOrientation']);

    let quality = 1;

    let tempFile = await this.canvasToFile(
      orientationFixedCanvas,
      options['fileType'] || file['type'],
      file['name'],
      file['lastModified'],
      quality,
    );

    const origExceedMaxSize = tempFile['size'] > maxSizeByte;
    const sizeBecomeLarger = tempFile['size'] > file['size'];

    if (!origExceedMaxSize && !sizeBecomeLarger) {
      this.cleanupCanvasMemory(maxWidthOrHeightFixedCanvas);
      this.cleanupCanvasMemory(orientationFixedCanvas);

      return tempFile;
    }

    const sourceSize = file['size'];
    const renderedSize = tempFile['size'];
    let currentSize = renderedSize;
    let compressedFile;
    let newCanvas;
    let ctx;
    let canvas = orientationFixedCanvas;
    while (remainingTrials-- && (currentSize > maxSizeByte || currentSize > sourceSize)) {
      const newWidth = origExceedMaxSize ? canvas['width'] * 0.95 : canvas['width'];
      const newHeight = origExceedMaxSize ? canvas['height'] * 0.95 : canvas['height'];
      [newCanvas, ctx] = this.getNewCanvasAndCtx(newWidth, newHeight);

      ctx.drawImage(canvas, 0, 0, newWidth, newHeight);

      if (file['type'] === 'image/jpeg') {
        quality *= 0.95;
      }

      compressedFile = await this.canvasToFile(
        newCanvas,
        options['fileType'] || file['type'],
        file['name'],
        file['lastModified'],
        quality,
      );

      this.cleanupCanvasMemory(canvas);

      canvas = newCanvas;
      currentSize = compressedFile['size'];
    }

    this.cleanupCanvasMemory(canvas);
    this.cleanupCanvasMemory(newCanvas);
    this.cleanupCanvasMemory(maxWidthOrHeightFixedCanvas);
    this.cleanupCanvasMemory(orientationFixedCanvas);

    return compressedFile;
  }
}
