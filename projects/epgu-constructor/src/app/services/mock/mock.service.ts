import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MockService {
  public currentUserId = '1000415878'; // Николаев
  // public currentUserId = '1000415878'; // Федоров
  // eslint-disable-next-line max-len
  public currentUserToken = 'eyJ2ZXIiOjEsInR5cCI6IkpXVCIsInNidCI6ImFjY2VzcyIsImFsZyI6IlJTMjU2In0.eyJuYmYiOjE1OTg4NTkxMjEsInNjb3BlIjoiaHR0cDpcL1wvZXNpYS5nb3N1c2x1Z2kucnVcL3Vzcl9pbmY_b2lkPTEwMDA0MTU4NzgmbW9kZT13IGh0dHA6XC9cL2VzaWEuZ29zdXNsdWdpLnJ1XC91c3Jfc2VjP21vZGU9dyZvaWQ9MTAwMDQxNTg3OCBodHRwOlwvXC9lc2lhLmdvc3VzbHVnaS5ydVwvdXNyX3RybT9vaWQ9MTAwMDQxNTg3OCZtb2RlPXciLCJpc3MiOiJodHRwOlwvXC9lc2lhLXBvcnRhbDEudGVzdC5nb3N1c2x1Z2kucnVcLyIsInVybjplc2lhOnNpZCI6Ijc3NGE1MmUzZjdiMGViZjc3NzlmMTlkMDY0ZmYwYzMxOWI2OGZhNjRhYjYyZDNkNmZkM2QwM2JkNzQzYTgwZmIiLCJ1cm46ZXNpYTpzYmpfaWQiOjEwMDA0MTU4NzgsImV4cCI6MTU5ODk0NTUyMSwiaWF0IjoxNTk4ODU5MTIxLCJjbGllbnRfaWQiOiJQR1UifQ.QDi7IxbfYum_8jkAWXuMAuZUmu3ZxcIwe0eUz-vJ4xyJQu0Imvtmh69-NkIl6EizBQhgopT9vjONwZwTClgUGA7BwqIojY1oLl5BLq_lxWSnFv0rKvHLUkjv37HbL800z80tsQ1HdNQQnCpvklf4J7i_sKWcErS60ohatn1TMwgsUHg_f3tqS6ZRV1megsUhafOmtfDMrB79jmMpRtFBgevsjRWWsOk_JHoII90pj31rAm1s-frZO9Jxsn-PXeT_WzrYr90oujr7HhpMZS58SVGQbQ2JgXnCKGAwFATU9nxmE97IDR4k3dr4uCS06qfhd4BYSb-3RnbqDaCfZeyGDA';

  constructor() { }
}
