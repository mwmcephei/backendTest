import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Sheet, SheetSchema } from '../schemas/sheet.schema';
import { Measure, MeasureSchema } from '../schemas/measure.schema';
import { Artefact, ArtefactSchema } from '../schemas/artefact.schema';
import { Budget, BudgetSchema } from '../schemas/budget.schema';
import { Notification, NotificationSchema } from '../schemas/notification.schema';
import { NotificationStatus, NotificationStatusSchema } from '../schemas/notificationStatus.schema';
import { Model } from 'mongoose';
import { fileNames } from 'src/globalVars';
import '../types';
import { Overview, PastBudget } from '../types';

@Injectable()
export class ApiService {
  constructor(
    @InjectModel('Artefact') private artefactModel: Model<Artefact>,
    @InjectModel('Measure') private measureModel: Model<Measure>,
    @InjectModel('Sheet') private sheetModel: Model<Sheet>,
    @InjectModel('Budget') private budgetModel: Model<Budget>,
    @InjectModel('PastBudget') private pastBudgetModel: Model<PastBudget>,
    @InjectModel('Notification') private notificationModel: Model<Notification>,
    @InjectModel('NotificationStatus') private notificationStatusModel: Model<NotificationStatus>,
  ) { }

  async getMeasure(measureID: string): Promise<Measure> {
    try {
      const measure = await this.measureModel.findById(measureID);
      return measure;
    } catch (error) {
      return error;
    }
  }

  async getArtefactsOfMeasure(measureID: string): Promise<Artefact[]> {
    try {
      const measure = await this.measureModel
        .findById(measureID)
        .sort({ id: 'asc' });
      const populatedMeasure = await measure
        .populate('artefacts')
        .execPopulate();
      console.log("ARTEFACTSARTEFACTSARTEFACTSARTEFACTSARTEFACTSARTEFACTSARTEFACTSARTEFACTS")
      console.log(populatedMeasure.artefacts)
      return populatedMeasure.artefacts;
    } catch (error) {
      return error;
    }
  }

  async getAllMeasures(): Promise<Measure[]> {
    try {
      const result = await this.measureModel.find().sort({ id: 'asc' });
      return result;
    } catch (error) {
      return error;
    }
  }

  async getOverview(): Promise<Sheet> {
    try {
      const excelSheet = await this.sheetModel.findOne({
        name: fileNames.main_file,
      });
      return excelSheet;
    } catch (error) {
      return error;
    }
  }

  async getBudget(): Promise<Budget> {
    try {
      const budget = await this.budgetModel.findOne();
      return budget;
    } catch (error) {
      return error;
    }
  }

  async getPastBudgets(): Promise<PastBudget[]> {
    try {
      const result = await this.pastBudgetModel.find();
      console.log(result)
      return result;
    } catch (error) {
      return error;
    }
  }




  async lookAtNotifications(): Promise<Notification[]> {
    try {
      const allNots = await this.notificationModel.find();
      if (allNots) {
        allNots.forEach(async n => {
          await n.update({
            seen: true
          })
        })
      }
      return allNots;
    } catch (error) {
      return error;
    }
  }

  async getNotifications(): Promise<Notification[]> {
    try {
      const result = await this.notificationModel.find();
      console.log(result)
      return result;
    } catch (error) {
      return error;
    }
  }

  async setNotification(notification): Promise<Notification> {
    try {
      console.log("save new NOTIFICATION")
      console.log(notification)
      const newNot = new this.notificationModel(notification);
      await newNot.save()
      return newNot
    } catch (error) {
      return error;
    }
  }

  async checkNotifications(): Promise<NotificationStatus> {
    try {
      const change = await this.notificationStatusModel.findOne({
        change: true,
      });
      if (change) {
        await change.update({
          change: false
        })
        return change
      } else {
        const newChange = new this.notificationStatusModel({
          change: false
        });
        return newChange
      }
    } catch (error) {
      return error;
    }
  }

  async filesChanged(): Promise<NotificationStatus[]> {
    try {
      const existingChange = await this.notificationStatusModel.findOne();
      if (existingChange) {
        await existingChange.update({
          change: true
        });
      } else {
        const newChange = new this.notificationStatusModel({
          change: true
        });
        await newChange.save()
      }
    } catch (error) {
      return error;
    }
  }


}





