import { Redis } from "@upstash/redis"

const redis = Redis.fromEnv()

function getMonthKey() {
  const now = new Date()

  return `${now.getUTCFullYear()}-${String(
    now.getUTCMonth() + 1,
  ).padStart(2, "0")}`
}

export async function trackMonthlyVisitor(visitorId: string) {
  const month = getMonthKey()
  const key = `monthly-visitors:${month}`

  await redis.sadd(key, visitorId)
  await redis.expire(key, 60 * 60 * 24 * 400)

  return redis.scard(key)
}

export async function getMonthlyVisitors() {
  const month = getMonthKey()
  const key = `monthly-visitors:${month}`

  return redis.scard(key)
}