import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Project } from '../../../../../typings';
import data from '../../../../../stubs/projects.stub';

@Component({
  selector: 'children-clubs-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss', '../../../../../styles.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewComponent {
  data$: Observable<Project> = of(data[0]);

  next(): void {}
  showPlan(): void {}
  showGoals(): void {}
  showResults(): void {}
  showConditions(): void {}
}
