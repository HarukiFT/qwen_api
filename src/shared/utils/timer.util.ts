export const useTimer = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(undefined);
    }, delay);
  });
};
