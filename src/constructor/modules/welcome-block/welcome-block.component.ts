import {Component, Input, OnInit} from '@angular/core';
import {SimpleComponentInterface} from '../../interfaces/simple-component.interface';

@Component({
  selector: 'welcome-block',
  templateUrl: './welcome-block.component.html',
  styleUrls: ['./welcome-block.component.scss']
})
export class WelcomeBlockComponent implements OnInit {
  @Input() data: SimpleComponentInterface;

  constructor() { }

  ngOnInit(): void {
  }

  nextStep() {}
}
