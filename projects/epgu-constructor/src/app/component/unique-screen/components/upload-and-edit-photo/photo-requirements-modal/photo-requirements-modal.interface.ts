export interface PhotoRequirementsModalSetting {
  warning?: string;
  body: {
    title: string;
    text: string;
    type: string;
    examplePhotos: {
      valid: boolean;
      description: string;
      type: string;
    }[];
  }[];
  footer?: string;
}
