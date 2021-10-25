import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Sheet, SheetSchema } from '../schemas/sheet.schema';
import { Measure, MeasureSchema } from '../schemas/measure.schema';
import { Artefact, ArtefactSchema } from '../schemas/artefact.schema';
import { Budget, BudgetSchema } from '../schemas/budget.schema';
import { Notification, NotificationSchema } from '../schemas/notification.schema';
import { NotificationStatus, NotificationStatusSchema } from '../schemas/notificationStatus.schema';
import { Model } from 'mongoose';
import { fileNames, rootPath } from 'src/globalVars';
import '../types';
import { Overview, PastBudget } from '../types';
import { Upload } from 'src/schemas/upload.schema';
const fs = require('fs');


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
    @InjectModel('Upload') private uploadModel: Model<Upload>,
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
      return populatedMeasure.artefacts;
    } catch (error) {
      return error;
    }
  }

  async getMeasureID(measureTitle: string): Promise<string> {
    console.log("_________________getMeasureID______________")
    console.log(measureTitle)
    try {
      const measure = await this.measureModel.findOne({
        title: measureTitle,
      });
      return measure._id
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
      const excelSheet = await this.sheetModel.findOne();
      console.log(excelSheet)
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

  async getNotifications(all): Promise<Notification[]> {
    try {
      let result
      if (all) {
        console.log("all")
        console.log(all)
        result = await this.notificationModel.find();
      } else {
        result = await this.notificationModel.find({
          notified: false
        });
        if (result) {
          for (let i = 0; i > result.length; i++) {
            const updated = await result[i].update({ notified: true })
          }
        }
      }
      console.log(result)
      return result;
    } catch (error) {
      return error;
    }
  }

  async setToNotified(result) {
    if (result) {
      for (let i = 0; i < result.length; i++) {
        const updated = await result[i].update({ notified: true })
      }
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
        console.log("found notification")
        await change.update({
          change: false
        })
        return change
      } else {
        console.log("no notification")
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
    console.log("something hapening")
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


  async HandleFileUpload(originalname, targetFileName): Promise<boolean> {
    fs.rename(rootPath + '/files/' + originalname, rootPath + '/data/' + targetFileName, function (err) {
      if (err) console.log('ERROR: ' + err);
    });
    return true
  }


  async createNotificationForFileChange(fileCategory): Promise<boolean> {
    let fileName = ""
    switch (parseInt(fileCategory)) {
      case 1:
        fileName = "Budget Report"
        break;
      case 2:
        fileName = "KPI Report"
        break;
      case 3:
        fileName = "Status Report"
        break;
      case 4:
        fileName = "Measure Overview"
        break;
      case 5:
        fileName = "All Budgets"
        break;
      default:
        fileName = ""
        break;
    }
    const notification = {
      title: "File Upload",
      body: "A new " + fileName + " file has been uploaded",
      time: this.datetimNow(),
      type: "file",
      measure: "",
      seen: false,
      notified: false
    }
    const newNot = new this.notificationModel(notification);
    await newNot.save()
    const upload = await this.uploadModel.findOne({
      name: fileName
    })
    if (upload) {
      await upload.update({
        date: new Date().toISOString().split('T')[0],
        ok: true
      });
    } else {
      const newUpload = new this.uploadModel({
        name: fileName,
        date: new Date().toISOString().split('T')[0],
        ok: true
      });
      await newUpload.save()
    }
    return true
  }



  async getUploadInfo(): Promise<Upload[]> {
    try {
      const uploadInfo = await this.uploadModel.find();
      return uploadInfo
    } catch (error) {
      return error;
    }
  }


  datetimNow() {
    const currentdate = new Date();
    return currentdate.getDate() + "."
      + (currentdate.getMonth() + 1) + "."
      + currentdate.getFullYear() + " "
      + currentdate.getHours() + ":"
      + currentdate.getMinutes()
  }




}





