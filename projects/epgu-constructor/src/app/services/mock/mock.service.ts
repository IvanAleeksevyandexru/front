import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MockService {
  public currentUserId = '1000299353';
  // public currentUserId = '1000415878'; // Федоров
  // eslint-disable-next-line max-len
  public currentUserToken = 'eyJ2ZXIiOjEsInR5cCI6IkpXVCIsInNidCI6ImFjY2VzcyIsImFsZyI6IlJTMjU2In0.eyJuYmYiOjE1OTg2MTAxMzYsInNjb3BlIjoiaHR0cDpcL1wvZXNpYS5nb3N1c2x1Z2kucnVcL3Vzcl90cm0_b2lkPTEwMDAyOTkzNTMmbW9kZT13IGh0dHA6XC9cL2VzaWEuZ29zdXNsdWdpLnJ1XC91c3JfaW5mP29pZD0xMDAwMjk5MzUzJm1vZGU9dyBodHRwOlwvXC9lc2lhLmdvc3VzbHVnaS5ydVwvdXNyX3NlYz9tb2RlPXcmb2lkPTEwMDAyOTkzNTMiLCJpc3MiOiJodHRwOlwvXC9lc2lhLXBvcnRhbDEudGVzdC5nb3N1c2x1Z2kucnVcLyIsInVybjplc2lhOnNpZCI6IjEzMjI1ZjEwZjU4OGRlYzI0ZGZkYTYzYTNlMTBhMmJkOGE2YjNjZDQ4ZTJkMmY3ODAwOWZhOTdhMTg3NDMwNmUiLCJ1cm46ZXNpYTpzYmpfaWQiOjEwMDAyOTkzNTMsImV4cCI6MTU5ODY5NjUzNiwiaWF0IjoxNTk4NjEwMTM2LCJjbGllbnRfaWQiOiJQR1UifQ.wJl8sKcr5tMvX0j1jsw-v91p5OQvlJ7AmXYeCcjvS_gxNe7MJlCpx7mDxaS_tEMsAJg0H00QU5sUCUx2XTfLdyI-DBSNDK8L5ZJu7aYGnJubMpy4f47tyZO-pPdMfb4AMWyo7p6mHpKk7Sv0dfwwDDd3FVtPgnGHlmsb6oVit1kX98DjaIk5ssUNmmaMo5kvxyLhIMTceDuSq_vOUpDSeAKntjoG0Vc-CPxjgMfJsFlYrMgxQ5yF_dCl8nxr5qIAaZJMvPPEGm_8-NDmGrn58ItuY6pD8Agmi_luu_BO9mFgAtwzHXD3gZWk8Zs8Nv5TeZJSvTysmUXLOJ1ZoX_vbQ';
  constructor() { }
}
