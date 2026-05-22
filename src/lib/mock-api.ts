export const mockApi = async <T>(
  data: T,
  delay = 1500,
): Promise<{
  data: {
    data: T;
  };
}> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          data,
        },
      });
    }, delay);
  });
};