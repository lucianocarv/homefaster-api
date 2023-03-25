export const getFileName = async (url: string) => {
  const splited = url.split('/');
  const path = splited.slice(4).join('/');
  return path;
};
