import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'epgu-constructor-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabelComponent implements OnInit {
  @Input() for: string;
  @Input() required: boolean;
  @Input() tips: string;
  @Input() isTextHelper: boolean;
  @Input() label: string;

  ngOnInit(): void {}
}
