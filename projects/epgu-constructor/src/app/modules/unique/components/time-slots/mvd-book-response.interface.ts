export interface MvdBookResponseInterface {
  bookId: string;
  status: {
    statusCode: number;
  };
  timeSlot: {
    serviceId: string;
    organizationId: string;
    areaId: string;
    visitTime: number;
  };
  error: {
    errorDetail: {
      errorCode: number;
      errorMessage: string;
    };
  };
}
