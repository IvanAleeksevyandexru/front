import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MockService {
  public currentUserId = '1000299353'; // Николаев
  // public currentUserId = '1000415878'; // Федоров
  // eslint-disable-next-line max-len
  public currentUserToken = 'eyJ2ZXIiOjEsInR5cCI6IkpXVCIsInNidCI6ImFjY2VzcyIsImFsZyI6IlJTMjU2In0.eyJuYmYiOjE1OTg1NDUxMjUsInNjb3BlIjoiaHR0cDpcL1wvZXNpYS5nb3N1c2x1Z2kucnVcL3Vzcl90cm0_b2lkPTEwMDAyOTkzNTMmbW9kZT13IGh0dHA6XC9cL2VzaWEuZ29zdXNsdWdpLnJ1XC91c3JfaW5mP29pZD0xMDAwMjk5MzUzJm1vZGU9dyBodHRwOlwvXC9lc2lhLmdvc3VzbHVnaS5ydVwvdXNyX3NlYz9tb2RlPXcmb2lkPTEwMDAyOTkzNTMiLCJpc3MiOiJodHRwOlwvXC9lc2lhLXBvcnRhbDEudGVzdC5nb3N1c2x1Z2kucnVcLyIsInVybjplc2lhOnNpZCI6ImViMjgzODk4NjA2ZDU0YzgzYTZhODFjYjI5NGY0ODJiZjZlN2E5ODg5ZDA0ZWViYTJlNjc2OWYyZThjYmI3NWMiLCJ1cm46ZXNpYTpzYmpfaWQiOjEwMDAyOTkzNTMsImV4cCI6MTU5ODYzMTUyNSwiaWF0IjoxNTk4NTQ1MTI1LCJjbGllbnRfaWQiOiJQR1UifQ.n4BV80P6YqGV63Xn7oc-cf51Fco936cjLMjCIzzHlAOaeikas8ydVpvBQVkOC7U15vd6Pc1BOSHn42SQR8gFpvR7OfwQeuS7cELQHDJv1YpuWUThd4yfPuM4ohU7RP6OBobdV10W1ITYiO8F__Wv94duBfZvDlHbu9HQfhpaP0xewf2yYsc342Di5bIySE031VcWJAEhM3DbyhzoTggaU-qL9ClhguB9NKe3SpKAsIQPb5MJrJosLzrFjr-Y3npnayCOBPtEXuggDl7N1zulvuKUlnIHubBT4baZ9_kzQKM4-bi2zmQz6KcBgUjiKj9WALYejPOOFyXFMs4kxGQqiA';

  constructor() { }
}
