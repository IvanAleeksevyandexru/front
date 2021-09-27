export type AppLink = {
  type: string,
  image: string,
  title: string,
  href: string
};

export const ErrorType = {
  userAgent: 'navigator.userAgent is not available. It is impossible to determine operating system.',
  json: 'JSON "appLinks" does not contain client system app link.',
};
