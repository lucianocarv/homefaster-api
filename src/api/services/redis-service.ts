import { redisClient } from '../config/redis-connect'

const redisService = {
  getOrSetDataCache: async (key: string, cb: CallableFunction) => {
    try {
      const cache = await redisClient.get(key)
      if (cache !== null) {
        console.log('Cache Hint')
        return JSON.parse(cache)
      } else {
        console.log('Cache Miss')
        const freshData = await cb()
        redisClient.setEx(key, 30, JSON.stringify(freshData))
        return freshData
      }
    } catch (error) {
      console.log(error)
    }
  }
}

export { redisService }
