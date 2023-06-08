import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { reservationValidationSchema } from 'validationSchema/reservations';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getReservations();
    case 'POST':
      return createReservation();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getReservations() {
    const data = await prisma.reservation
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'reservation'));
    return res.status(200).json(data);
  }

  async function createReservation() {
    await reservationValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.preference?.length > 0) {
      const create_preference = body.preference;
      body.preference = {
        create: create_preference,
      };
    } else {
      delete body.preference;
    }
    const data = await prisma.reservation.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
