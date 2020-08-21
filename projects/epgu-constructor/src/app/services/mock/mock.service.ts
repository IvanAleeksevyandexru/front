import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MockService {
  public currentUserId = '1000299353'; // Николаев
  // userId = '1000415878'; // Федоров
  // eslint-disable-next-line max-len
  public currentUserToken = 'eyJ2ZXIiOjEsInR5cCI6IkpXVCIsInNidCI6ImFjY2VzcyIsImFsZyI6IlJTMjU2In0.eyJuYmYiOjE1OTc5Mjc2NTIsInNjb3BlIjoiaHR0cDpcL1wvZXNpYS5nb3N1c2x1Z2kucnVcL3Vzcl90cm0_b2lkPTEwMDAyOTkzNTMmbW9kZT13IGh0dHA6XC9cL2VzaWEuZ29zdXNsdWdpLnJ1XC91c3JfaW5mP29pZD0xMDAwMjk5MzUzJm1vZGU9dyBodHRwOlwvXC9lc2lhLmdvc3VzbHVnaS5ydVwvdXNyX3NlYz9tb2RlPXcmb2lkPTEwMDAyOTkzNTMiLCJpc3MiOiJodHRwOlwvXC9lc2lhLmdvc3VzbHVnaS5ydVwvIiwidXJuOmVzaWE6c2lkIjoiYTRiNTE0NTFjY2Q2NzcxOGE1YzhlMWMwODgzYjEzMmY5YzBmZjZlMGJjYjVmMDg2YTBhYTMzMzZkMWI0MDM1MSIsInVybjplc2lhOnNial9pZCI6MTAwMDI5OTM1MywiZXhwIjoxNTk4MDE0MDUyLCJpYXQiOjE1OTc5Mjc2NTIsImNsaWVudF9pZCI6IlBHVSJ9.b5A9qoB6AyOamGrJN0tyF840OxLTElFBvQiT7PqhN2qse-bCAirdMja3X8Haf9jenpcMBxh-X9hbQC2cieu4jiGO2wqGNMIGPUANGiGTPsaIp7OGsRm0Yk58TNT-zQq1_HhS8B4vVnRkuI-qvpHm8ADjkVgjVC3LbePhi0M_8Ndjroo2dtornOwds2EGfJ8AxvPKc9taKwvbiBE3eB_DfH6CSClNOgdr3x1C2KeM0uvp_YR_ejDPxq_LqmYHj69N9eVUfMirQkIRtf8WRUh2-yupasPRsVUxpRUl4dNnXg-lZRyHJu6EpCKrbTIGfMhZOuDTXPEZwuPyGgLR4lnUJQ';

  constructor() { }
}
