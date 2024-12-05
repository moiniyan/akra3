import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'

const SECRET_KEY = process.env.AUTH_SECRET || 'your-secret-key'

export const handlers = {
  GET: async (req: NextApiRequest, res: NextApiResponse) => {
    // Implement your GET handler logic here
    res.status(200).json({ message: 'GET handler' })
  },
  POST: async (req: NextApiRequest, res: NextApiResponse) => {
    // Implement your POST handler logic here
    res.status(200).json({ message: 'POST handler' })
  },
}

export const auth = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.cookies['auth-token']
  if (!token) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  try {
    const user = "";//jwt.verify(token, SECRET_KEY) as User
    req.user = user
    res.status(200).json({ user })
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' })
  }
}

export const signIn = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, password } = req.body
  const user = await findUserByEmailAndPassword(email, password)
  if (!user) {
    res.status(401).json({ message: 'Invalid credentials' })
    return
  }

  const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, SECRET_KEY, { expiresIn: '1h' })
  res.setHeader('Set-Cookie', `auth-token=${token}; HttpOnly; Path=/`)
  res.status(200).json({ user })
}

export const signOut = (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Set-Cookie', 'auth-token=; HttpOnly; Path=/; Max-Age=0')
  res.status(200).json({ message: 'Signed out' })
}

async function findUserByEmailAndPassword(email: string, password: string): Promise<User | null> {
  // Replace this with your actual user lookup logic
  // Example:
  if (email === 'user@example.com' && password === 'password') {
    return { id: '1', email, name: 'Example User' }
  }
  return null
}