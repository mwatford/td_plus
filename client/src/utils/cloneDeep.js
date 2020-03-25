const cloneDeep = value => {
  return JSON.parse(JSON.stringify(value));
};

export default cloneDeep