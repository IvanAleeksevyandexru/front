import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-label-section',
  templateUrl: './label-section.component.html',
  styleUrls: ['./label-section.component.scss'],
})
export class LabelSectionComponent {
  @Input() name: string;
}
