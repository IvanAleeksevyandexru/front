import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-answer-choice',
  templateUrl: './answer-choice.component.html',
  styleUrls: ['./answer-choice.component.scss'],
})
export class AnswerChoiceComponent implements OnInit {
  @Input()
  data: string;

  ngOnInit(): void {}
}
