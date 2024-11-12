const isMobile = /Android|webOS|iPhone|BlackBerry|Windows Phone/i.test(navigator.userAgent);

export const joints = 5;
export const width = isMobile ? 80 : 120;
export const instances = isMobile ? 10000 : 80000;
export const w_ = 0.12;
export const h_ = 1;

export const  flatSurfaceWidth = 26;
