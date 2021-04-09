export interface ComponentValue {
  url: string;
  path: string;
  body: string;
  headers: { [key: string]: string };
  method: string;
}
