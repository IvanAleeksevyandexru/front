import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class UniqueScreenService {
  public setProcessingStatus(
    { uploadId, status }: { uploadId: string; status: boolean },
    uploaderProcessing: BehaviorSubject<string[]>,
  ): void {
    const statusList = uploaderProcessing.getValue();
    const index = statusList.lastIndexOf(uploadId);
    if (status && index === -1) {
      statusList.push(uploadId);
      uploaderProcessing.next(statusList);
    } else if (!status && index !== -1) {
      statusList.splice(index, 1);
      uploaderProcessing.next(statusList);
    }
  }
}
