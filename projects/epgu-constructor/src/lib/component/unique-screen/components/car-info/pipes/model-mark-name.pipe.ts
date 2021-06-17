import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'modelMarkName'
})
export class ModelMarkNamePipe implements PipeTransform {

  transform(modelMarkName: string, markName: string, modelName: string ): string {
    return modelMarkName || [markName, modelName].filter((value) => !!value).join(' ');
  }

}
