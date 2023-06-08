import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { tableValidationSchema } from 'validationSchema/tables';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getTables();
    case 'POST':
      return createTable();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getTables() {
    const data = await prisma.table
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'table'));
    return res.status(200).json(data);
  }

  async function createTable() {
    await tableValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.reservation?.length > 0) {
      const create_reservation = body.reservation;
      body.reservation = {
        create: create_reservation,
      };
    } else {
      delete body.reservation;
    }
    const data = await prisma.table.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
