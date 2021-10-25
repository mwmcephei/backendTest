import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { XlsxParserService } from './xlsx-parser.service';
import { XlsxParserController } from './xlsx-parser.controller';
import { SheetSchema } from '../schemas/sheet.schema';
import { SheetTEMPSchema } from '../schemas/sheetTEMP.schema';
import { MeasureSchema } from '../schemas/measure.schema';
import { MeasureTEMPSchema } from '../schemas/measureTEMP.schema';
import { ArtefactSchema } from '../schemas/artefact.schema';
import { ArtefactTEMPSchema } from '../schemas/artefactTEMP.schema';
import { PastBudgetSchema } from '../schemas/pastBudget.schema';
import { BudgetSchema } from '../schemas/budget.schema';
import { BudgetTEMPSchema } from '../schemas/budgetTEMP.schema';
import { NotificationSchema } from 'src/schemas/notification.schema';
import { NotificationStatusSchema } from 'src/schemas/notificationStatus.schema';
import { UploadSchema } from 'src/schemas/upload.schema';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Sheet', schema: SheetSchema },
      { name: 'SheetTEMP', schema: SheetTEMPSchema },
      { name: 'Measure', schema: MeasureSchema },
      { name: 'MeasureTEMP', schema: MeasureTEMPSchema },
      { name: 'Artefact', schema: ArtefactSchema },
      { name: 'ArtefactTEMP', schema: ArtefactTEMPSchema },
      { name: 'Budget', schema: BudgetSchema },
      { name: 'BudgetTEMP', schema: BudgetTEMPSchema },
      { name: 'PastBudget', schema: PastBudgetSchema },
      { name: 'Notification', schema: NotificationSchema },
      { name: 'NotificationStatus', schema: NotificationStatusSchema },
      { name: 'Upload', schema: UploadSchema },
    ]),
  ],
  providers: [XlsxParserController, XlsxParserService],
  controllers: [XlsxParserController],
})
export class XlsxParserModule { }
