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

export interface LunaPassSuccess {
  isOk: boolean;
  jwt: string;
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
  onSuccess: (result: LunaPassSuccess) => void;
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
  checkLiveness(): void;
}

export interface LunaPassRect {
  x: number;
  y: number;
  width: number;
  height: number;
}
export interface LunaPassFrameResultDetails {
  ags: number;
  eyeglasses: string;
  faceFramePosition: { faceRect: LunaPassRect; frameRect: LunaPassRect; margins: number[] };
  headPose: { pitch: number; roll: number; yaw: number };
  liveness: { qualityScore: number; score: number };
  mouth: { occluded: number; opened: number; smile: number };
  quality: {
    blur: number;
    darkness: number;
    illumination: number;
    light: number;
    specularity: number;
    isBlurred: boolean;
    isDark: boolean;
    isHighlighted: boolean;
    isIlluminated: boolean;
    isSpecular: boolean;
  };
}
export interface LunaPassFrameResult {
  isOk: boolean;
  errors: string[];
  bestshot: string;
  details: LunaPassFrameResultDetails;
}

declare var LunaPass: LunaPassConstructor;

@Injectable()
export class IdentificationStreamService {
  constructor(private config: ConfigService, private ngZone: NgZone) {}

  createVideoStream(
    element: HTMLElement,
    onReady: () => void,
    onSuccess: (result: LunaPassSuccess) => void,
  ): LunaPassConstructor {
    return new LunaPass(
      element,
      this.config.wsIdentificationUrl,
      () => this.ngZone.run(() => onReady()),
      (result: LunaPassSuccess) => this.ngZone.run(() => onSuccess(result)),
    );
  }
}
