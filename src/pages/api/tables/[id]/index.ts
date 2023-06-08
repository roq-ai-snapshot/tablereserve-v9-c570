import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { tableValidationSchema } from 'validationSchema/tables';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.table
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getTableById();
    case 'PUT':
      return updateTableById();
    case 'DELETE':
      return deleteTableById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getTableById() {
    const data = await prisma.table.findFirst(convertQueryToPrismaUtil(req.query, 'table'));
    return res.status(200).json(data);
  }

  async function updateTableById() {
    await tableValidationSchema.validate(req.body);
    const data = await prisma.table.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteTableById() {
    const data = await prisma.table.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
