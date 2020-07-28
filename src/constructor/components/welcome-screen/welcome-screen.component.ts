import {Component, Input, OnInit} from '@angular/core';
import {SimpleComponentInterface} from '../../interfaces/simple-component.interface';

@Component({
  selector: 'app-welcome-screen',
  templateUrl: './welcome-screen.component.html',
  styleUrls: ['./welcome-screen.component.scss']
})
export class WelcomeScreenComponent implements OnInit {
  @Input() data: SimpleComponentInterface;

  constructor() { }

  ngOnInit(): void {
  }

  nextStep() {}
}
