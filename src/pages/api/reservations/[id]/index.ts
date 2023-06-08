import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { reservationValidationSchema } from 'validationSchema/reservations';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.reservation
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getReservationById();
    case 'PUT':
      return updateReservationById();
    case 'DELETE':
      return deleteReservationById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getReservationById() {
    const data = await prisma.reservation.findFirst(convertQueryToPrismaUtil(req.query, 'reservation'));
    return res.status(200).json(data);
  }

  async function updateReservationById() {
    await reservationValidationSchema.validate(req.body);
    const data = await prisma.reservation.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteReservationById() {
    const data = await prisma.reservation.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
