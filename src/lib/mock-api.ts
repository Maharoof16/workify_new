export const mockApi = async <T>(
  data: T,
  delay = 500,
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