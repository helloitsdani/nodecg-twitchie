import context from '../context'

const guarantee = <T>(
  promiseFn: (...params: any[]) => Promise<T>,
  { timeBetweenRetries = 30000, logger = context.log } = {}
) => {
  let retryPromise: Promise<T> = Promise.resolve(undefined as any)
  let retryTimeout: NodeJS.Timeout

  const createPromise = (...params: any[]) => {
    clearTimeout(retryTimeout)

    retryPromise = promiseFn(...params)

    retryPromise.catch(error => {
      retryTimeout = setTimeout(() => createPromise(...params), timeBetweenRetries)
      logger.error(`Guranteed promise rejected! Retrying in ${timeBetweenRetries / 1000} seconds...`, error)
    })

    return retryPromise
  }

  return (...params: any[]) => retryPromise.then(() => createPromise(...params)).catch(() => createPromise(...params))
}

export default guarantee
