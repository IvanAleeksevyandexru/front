import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ModalService } from '@epgu/epgu-constructor-ui-kit';
import { ProgramFiltersFormComponent } from '../program-filters/components/program-filters-form.component';
import { FormOutputValue } from '../program-filters/program-filters.models';

@Component({
  selector: 'children-clubs-project-list-page',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectListComponent {
  constructor(private modalService: ModalService) {}

  openFilter(): void {
    this.modalService.openModal<FormOutputValue>(ProgramFiltersFormComponent).subscribe((value) => {
      console.log(value);
    });
  }
}
