import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'epgu-constructor-expansion-link',
  templateUrl: './expansion-link.component.html',
  styleUrls: ['./expansion-link.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpansionLinkComponent implements OnInit {
  @Input() isExpanded = false;

  ngOnInit(): void {}
}
