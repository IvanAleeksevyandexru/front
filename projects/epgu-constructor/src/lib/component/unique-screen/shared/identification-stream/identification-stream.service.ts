import { Injectable, NgZone } from '@angular/core';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';

export interface LunaPassInfo {
  FRAME_HEIGHT: number;
  FRAME_WIDTH: number;
  canvasInfo: HTMLCanvasElement;
  ctxInfo: CanvasRenderingContext2D;
  dpr: number;
  faceBB: {
    h: number;
    nH: number;
    nW: number;
    nX: number;
    nY: number;
    sX: number;
    sY: number;
    w: number;
    x: number;
    y: number;
  };
  images: {
    down: HTMLImageElement;
    left: HTMLImageElement;
    pitchBack: HTMLImageElement;
    pitchFront: HTMLImageElement;
    right: HTMLImageElement;
    rotationLeft: HTMLImageElement;
    rotationRight: HTMLImageElement;
    up: HTMLImageElement;
    yawLeft: HTMLImageElement;
  };
  imgPaths: {
    down: string;
    left: string;
    pitchBack: string;
    pitchFront: string;
    right: string;
    rotationLeft: string;
    rotationRight: string;
    up: string;
    yawLeft: string;
  };
  reqId: number;
}

export interface LunaPassConstructor {
  canvasVideo: HTMLCanvasElement;
  ctxVideo: CanvasRenderingContext2D;
  dpr: number;
  info: LunaPassInfo;
  isCameraAttached: boolean;
  isProcessing: boolean;
  isVideoAttached: boolean;
  isWSConnected: boolean;
  isReady: boolean;
  onReady: () => void;
  onSuccess: () => void;
  rootNode: HTMLElement;
  video: HTMLVideoElement;
  ws: WebSocket;
  wsConnectionString: string;

  new (
    element: HTMLElement,
    wsConnectionString: string,
    onReady: () => void,
    onSuccess: (result: unknown) => void,
  );
}

declare var LunaPass: LunaPassConstructor;

@Injectable()
export class IdentificationStreamService {
  constructor(private config: ConfigService, private ngZone: NgZone) {}

  createVideoStream(
    element: HTMLElement,
    onReady: () => void,
    onSuccess: (result: unknown) => void,
  ): LunaPassConstructor {
    return new LunaPass(
      element,
      this.config.wsIdentificationUrl,
      () => this.ngZone.run(() => onReady()),
      (result) => this.ngZone.run(() => onSuccess(result)),
    );
  }
}
