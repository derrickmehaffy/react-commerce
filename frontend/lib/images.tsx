export function getImage(path: string): string {
   const siteName = 'https://assets.cdn.ifixit.com/';
   const staticDir = 'static/images/';
   return siteName + staticDir + path;
}
