import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'children-clubs-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss', '../../../../../styles/index.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent {
  @Input() title = 'Ничего не найдено';
  @Input() text = 'Задайте другой поисковый запрос или измените фильтры';
}
