const getFileName = async (url: string) => {
  const splited = url.split('/');
  const filename = splited[splited.length - 1];
  return filename;
};

export { getFileName };
