import { Injectable } from '@angular/core';
import { MockCurrentUserId, MockCurrentUserToken } from './mock.constants';

@Injectable({
  providedIn: 'root'
})
export class MockService {
  // public currentUserId = '1000305301'; // Петренко Л.Н.
  // public currentUserId = '1000299353'; // Николаев
  public currentUserId = MockCurrentUserId; // Николаев Н. Н. физ. лицо
  // public currentUserId = '1000415878'; // Федоров
  // eslint-disable-next-line max-len
  public currentUserToken = MockCurrentUserToken;
  constructor() { }
}
