export const createFakeEvent = (name: string, value?: any) => ({
  target: {
    name,
    value,
  },
});
