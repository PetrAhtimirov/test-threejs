const isMobile = /Android|webOS|iPhone|BlackBerry|Windows Phone/i.test(navigator.userAgent);

export const joints = 5;
export const width = isMobile ? 50 : 120;
export const instances = isMobile ? 15000 : 75000;
export const w_ = 0.12;
export const h_ = 1;
