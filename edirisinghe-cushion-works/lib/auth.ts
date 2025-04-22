import { cookies } from "next/headers"
import { jwtVerify } from "jose"

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error("Please define the JWT_SECRET environment variable")
}

export async function auth() {
  const cookieStore = cookies()
  const token = cookieStore.get("auth-token")?.value

  if (!token) {
    return null
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))

    return payload
  } catch (error) {
    console.error("Auth error:", error)
    return null
  }
}
