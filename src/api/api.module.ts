import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';

import { Sheet, SheetSchema } from '../schemas/sheet.schema';
import { Measure, MeasureSchema } from '../schemas/measure.schema';
import { Artefact, ArtefactSchema } from '../schemas/artefact.schema';
import { Budget, BudgetSchema } from '../schemas/budget.schema';
import { PastBudget, PastBudgetSchema } from '../schemas/pastBudget.schema';
import { Notification, NotificationSchema } from '../schemas/notification.schema';
import { NotificationStatus, NotificationStatusSchema } from '../schemas/notificationStatus.schema';
import { UploadSchema } from 'src/schemas/upload.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Sheet', schema: SheetSchema },
      { name: 'Measure', schema: MeasureSchema },
      { name: 'Artefact', schema: ArtefactSchema },
      { name: 'Budget', schema: BudgetSchema },
      { name: 'PastBudget', schema: PastBudgetSchema },
      { name: 'Notification', schema: NotificationSchema },
      { name: 'NotificationStatus', schema: NotificationStatusSchema },
      { name: 'Upload', schema: UploadSchema },
    ]),
  ],
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule { }
