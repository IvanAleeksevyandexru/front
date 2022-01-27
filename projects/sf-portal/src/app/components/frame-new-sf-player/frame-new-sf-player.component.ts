import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ServerFormData } from '../new-sf-player/cards-forms.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'frame-portal-new-sf-player',
  templateUrl: './frame-new-sf-player.component.html',
  styleUrls: ['./frame-new-sf-player.component.scss'],
})
export class FrameNewSfPlayerComponent implements OnInit, AfterViewInit {

  @Input() playerUrl: string = 'https://vbeta.test.gosuslugi.ru:8888/600100/1';
  @Input() playerData: ServerFormData = {
    serviceId:'10000000100',
    targetId:'-10000000100',
    // @ts-ignore
    serviceInfo:{
      department: {id:'10000001197',title:'Министерство внутренних дел Российской Федерации'},
      error:'Region not found',
      routeNumber:null,
      billNumber:null,
      orderType:'ORDER',
      userRegion: {codes:['52401000000','52000000000'],name:'Омск',path:'Омская область/Омск'},
      queryParams:{},
      formId:'1',
    }
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
    } else if (window['attachEvent']) {
      window['attachEvent']('onmessage', this.handleMessage.bind(this));
    }
  }

  handleMessage(event: MessageEvent) {
    if (!this.hasSend && event.data === 'init') {
      this.framePlayer.nativeElement.contentWindow.postMessage(this.playerData, '*');
      this.hasSend = true;
    }
  }
}
