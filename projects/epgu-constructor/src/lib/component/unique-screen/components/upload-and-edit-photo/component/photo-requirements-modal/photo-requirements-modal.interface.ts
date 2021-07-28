export interface PhotoRequirementsModalSetting {
  warning?: string;
  body: Array<{
    title: string;
    text: string;
    type: string;
    examplePhotos: Array<{
      valid: boolean;
      description: string;
      type: string;
    }>;
  }>;
  footer?: string;
}
