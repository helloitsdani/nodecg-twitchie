const guarantee = (
  promiseFn,
  {
    timeBetweenRetries = 30000,
    logger = console,
  } = {}
) => {
  let retryPromise = Promise.resolve()
  let retryTimeout

  const createPromise = (...params) => {
    retryTimeout = clearTimeout(retryTimeout)
    retryPromise = promiseFn(...params)
      .catch((error) => {
        retryTimeout = setTimeout(
          () => createPromise(...params),
          timeBetweenRetries
        )

        logger.error(
          `Guranteed promise rejected! Retrying in ${timeBetweenRetries / 1000} seconds...`,
          error
        )
      })

    return retryPromise
  }

  return (...params) =>
    retryPromise
      .then(() => createPromise(...params))
      .catch(() => createPromise(...params))
}

module.exports = guarantee
