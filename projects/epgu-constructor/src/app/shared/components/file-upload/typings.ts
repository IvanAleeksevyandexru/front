import { BehaviorSubject } from 'rxjs';
import { Uploader } from './models/Uploader.model';
import { FileItem } from './models/FileItem.model';
import { Observable } from 'rxjs/internal/Observable';
import { OperationType } from './file-upload-item/data';
import { filter } from 'rxjs/operators';
import { UploaderProcessService } from './services/process/uploader-process.service';

export abstract class ProcessOperation {
  cancel = new BehaviorSubject<boolean>(false);
  cancel$ = this.cancel.pipe(filter((status) => status));
  type: OperationType;

  constructor(
    protected processing: UploaderProcessService,
    public uploader: Uploader,
    public file: FileItem,
  ) {}

  abstract run(): Observable<void>;
  abstract onCancel(): void;

  get id(): string {
    return `${this.type}${this.file.id}`;
  }
}
