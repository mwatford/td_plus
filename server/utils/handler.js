module.exports = (promise, params) => async (req, res, next) => {
  const boundParams = params ? params(req, res, next) : {};
  try {
    const response = await promise(boundParams);

    return res.status(response.status).send(response.data);
  } catch (error) {
    return res.status(500) && next(error);
  }
};
