import { setCookie } from 'nookies'
import { prisma } from '../../../lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const { name, username } = req.body

  const userExists = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (userExists) {
    return res.status(400).json({
      message: 'Username already taken',
    })
  }

  const user = await prisma.user.create({
    data: {
      name,
      username,
    },
  })

  setCookie({ res }, '@kawassakicall:userId', user.id, {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/', // rotas que podem acessar, '/' todas as rotas
  })

  return res.status(201).json(user)
}
