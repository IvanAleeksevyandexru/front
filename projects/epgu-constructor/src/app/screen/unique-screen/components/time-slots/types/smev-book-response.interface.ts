export interface SmevBookResponseInterface {
  bookId: string;
  esiaId: string;
  status: {
    statusCode: number;
    statusMessage: string;
  };
  timeSlot: {
    slotId: string;
    serviceId: string;
    organizationId: string;
    areaId: string;
    visitTime: number;
    visitTimeStr: string;
    queueNumber;
    duration;
    attributes: [];
  };
  error: {
    errorDetail: {
      errorCode: number;
      errorMessage: string;
    };
    fieldErrors: [];
  };
}
