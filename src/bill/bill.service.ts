import { Injectable } from '@nestjs/common';
import { NotificationType, Prisma } from '@prisma/client';

interface CreateBill {
    crmId: number;
    value: string | number | Prisma.Decimal
    paymentIdList: string;
    paymentDate?: string | Date
    notification: {
        type: NotificationType
        message: Prisma.NullTypes.JsonNull | Prisma.InputJsonValue;
        to: string;
        answered?: boolean;
        sent?: string | Date;
    }
}

@Injectable()
export class BillService {



}
