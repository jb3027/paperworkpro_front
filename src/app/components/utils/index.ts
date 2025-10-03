export function createPageUrl(pageName: string): string {
  // Convert page name to URL path
  switch (pageName.toLowerCase()) {
    case 'productions':
      return '/productions';
    case 'production':
      return '/production';
    default:
      return `/${pageName.toLowerCase()}`;
  }
}