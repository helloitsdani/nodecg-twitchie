import context from '../context'

const guarantee = <T>(
  promiseFn: (...params: any[]) => Promise<T>,
  { timeBetweenRetries = 30000, logger = context.log } = {},
) => {
  let retryTimeout: NodeJS.Timeout

  const createPromise = (...params: any[]) => {
    clearTimeout(retryTimeout)

    const pendingPromise = promiseFn(...params).catch(error => {
      retryTimeout = setTimeout(() => createPromise(...params), timeBetweenRetries)
      logger.error(`Guranteed promise rejected! Retrying in ${timeBetweenRetries / 1000} seconds...`, error)
    })

    return pendingPromise
  }

  return (...params: any[]) => {
    createPromise(...params)

    return () => {
      clearTimeout(retryTimeout)
    }
  }
}

export default guarantee
