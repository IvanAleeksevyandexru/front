export interface ZagsSlotsResponseInterface {
  slots: [
    {
      slotId: string;
      serviceId: string;
      organizationId: string;
      areaId: string;
      visitTime: number;
      visitTimeStr: string;
      visitTimeISO: string;
      queueNumber;
      duration;
      attributes: [];
    }
  ];
  error: {
    errorDetail: {
      errorCode: number;
      errorMessage: string;
    };
    fieldErrors: [];
  }
}
