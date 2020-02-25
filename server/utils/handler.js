module.exports = (promise, params) => async (req, res, next) => {
  const boundParams = params ? params(req, res, next) : {};
  try {
    const { status, data } = await promise(boundParams);

    return res.status(status).send(data);
  } catch (error) {
    return res.status(500) && next(error);
  }
};
