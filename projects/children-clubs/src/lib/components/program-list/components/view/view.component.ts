import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AppNavigationService, ModalService } from '@epgu/epgu-constructor-ui-kit';
import { Project } from '../../../../../typings';
import data from '../../../../../stubs/projects.stub';

@Component({
  selector: 'children-clubs-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss', '../../../../../styles/index.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewComponent {
  data$: Observable<Project> = of(data[0]);

  constructor(private modal: ModalService, private appNavigationService: AppNavigationService) {}

  next(): void {
    this.appNavigationService.next();
  }
  showPlan(): void {}
  showGoals(): void {}
  showResults(): void {}

  showConditions(): void {}
}
