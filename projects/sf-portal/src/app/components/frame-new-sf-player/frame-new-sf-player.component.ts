import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ServerFormDataEmbedding } from '../new-sf-player/cards-forms.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'frame-portal-new-sf-player',
  templateUrl: './frame-new-sf-player.component.html',
  styleUrls: ['./frame-new-sf-player.component.scss'],
})
export class FrameNewSfPlayerComponent implements OnInit, AfterViewInit {
  @Input() playerUrl: string = 'https://vbeta.test.gosuslugi.ru:8888/600100/1';
  @Input() playerData: ServerFormDataEmbedding = {
    serviceId: '10000000100',
    targetId: '-10000000100',
    authToken:
      // eslint-disable-next-line max-len
      'eyJ2ZXIiOjEsInR5cCI6IkpXVCIsInNidCI6ImFjY2VzcyIsImFsZyI6IlJTMjU2In0.eyJuYmYiOjE2NDUxOTA2OTMsInNjb3BlIjoib3BlbmlkIGh0dHA6XC9cL2VzaWEuZ29zdXNsdWdpLnJ1XC91c3JfdHJtP21vZGU9dyZvaWQ9MTAwMDI5OTM1MyBodHRwOlwvXC9lc2lhLmdvc3VzbHVnaS5ydVwvdXNyX2luZj9tb2RlPXcmb2lkPTEwMDAyOTkzNTMgaHR0cDpcL1wvZXNpYS5nb3N1c2x1Z2kucnVcL3Vzcl9zZWM_bW9kZT13Jm9pZD0xMDAwMjk5MzUzIiwiaXNzIjoiaHR0cDpcL1wvZXNpYS1wb3J0YWwxLnRlc3QuZ29zdXNsdWdpLnJ1XC8iLCJ1cm46ZXNpYTpzaWQiOiI0YWI5ZGExZS03MmMxLTRiNTYtOTA2ZS04YmYzMmNmMTc4NmMiLCJ1cm46ZXNpYTpzYmpfaWQiOjEwMDAyOTkzNTMsImV4cCI6MTY0NTIwMTQ5MywiaWF0IjoxNjQ1MTkwNjkzLCJjbGllbnRfaWQiOiJQR1UifQ.V_eWTI1WoK2rXhqcBhN517M3jreqeabDvbav9XA2b4XfRYZt-0S0eWjFN5CGg69ePPFcXBniRQnUf-pnPKoqUTGmdq4uFGpe9GYpIymu8rCeiOoUdcmcnJCXoGjyK3jmIfXbLZr4Ublntho60ck-KlY_8JNq4-Z2-c5TkabUQg7rbU4yjuEXZ4-jpSJA-m_mjkR_0WZ0dJFNQ-l0RitAD-zX0q8P0BhFQs1GDzvXmDa-43b0e9fzaN3e2bbBobqgGbH09yYIvo5O9E2cIg0RyY7A8dUPEpV8kLne6k_FCIi8I622UDuPclXAvIeE80giN0Zq4LpTwPNpz4K3zrkTig',
    // @ts-ignore
    serviceInfo: {
      department: { id: '10000001197', title: 'Министерство внутренних дел Российской Федерации' },
      error: 'Region not found',
      routeNumber: null,
      billNumber: null,
      orderType: 'ORDER',
      userRegion: {
        codes: ['52401000000', '52000000000'],
        name: 'Омск',
        path: 'Омская область/Омск',
      },
      queryParams: {},
      formId: '1',
    },
  };

  @ViewChild('framePlayer') framePlayer: ElementRef;

  public safePlayerUrl: SafeResourceUrl;
  private hasSend: boolean;

  constructor(private sanitizer: DomSanitizer) {}

  public ngOnInit(): void {
    this.safePlayerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.playerUrl);
  }

  ngAfterViewInit() {
    if (window.addEventListener) {
      window.addEventListener('message', this.handleMessage.bind(this), false);
      // @ts-ignore
    } else if (window.attachEvent) {
      // @ts-ignore
      window.attachEvent('onmessage', this.handleMessage.bind(this));
    }
  }

  handleMessage(event: MessageEvent) {
    if (!this.hasSend && event.data === 'init') {
      this.framePlayer.nativeElement.contentWindow.postMessage(this.playerData, '*');
      this.hasSend = true;
    }
  }
}
