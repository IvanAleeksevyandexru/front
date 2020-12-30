import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'epgu-constructor-screen-pad',
  templateUrl: './screen-pad.component.html',
  styleUrls: ['./screen-pad.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScreenPadComponent implements OnInit {
  ngOnInit(): void {}
}
