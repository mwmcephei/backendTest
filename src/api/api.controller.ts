import { Controller, Get, Post, Param, Body, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { ApiService } from './api.service';
import { Express } from 'express'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Notification } from '../schemas/notification.schema';
import { NotificationStatus } from '../schemas/notificationStatus.schema';
import { rootPath } from 'src/globalVars';
const fs = require('fs');
const util = require('util');


export class UploadDto {
  filename: string;
  file: object;
}

export class SetNotificationDto {
  title: string;
  body: string;
  seen: boolean
}


@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) { }


  @Get('measure/:measureID')
  getMeasure(@Param() params) {
    return this.apiService.getMeasure(params.measureID);
  }

  @Get('measure/:measureID/artefacts')
  getArtefactsOfMeasure(@Param() params) {
    return this.apiService.getArtefactsOfMeasure(params.measureID);
  }

  @Get('getMeasureID/:measureTitle')
  async getMeasureID(@Param() params) {
    const measureID = await this.apiService.getMeasureID(params.measureTitle);
    console.log("measureID")
    console.log(params.measureTitle)
    console.log(measureID)
    return measureID

  }

  @Get('overview')
  getOverview() {
    return this.apiService.getOverview();
  }

  @Get('measures')
  getAllMeasures() {
    return this.apiService.getAllMeasures();
  }

  @Get('budget')
  getBudget() {
    return this.apiService.getBudget();
  }

  @Get('pastBudget')
  getPastBudgets() {
    return this.apiService.getPastBudgets();
  }

  @Get("getNotifications/:all")
  async getNotifications(@Param() params) {
    const allAsBool = (params.all === 'true')
    const result = await this.apiService.getNotifications(allAsBool);
    if (result) {
      await this.apiService.setToNotified(result);
    }
    return result
  }

  @Get("lookAtNotifications")
  lookAtNotifications() {
    return this.apiService.lookAtNotifications();
  }

  @Post("setNotification")
  async setNotification(@Body() notification: SetNotificationDto) {
    console.log(notification)
    return this.apiService.setNotification(notification);
  }

  @Get('checkNotifications')
  checkNotifications() {
    return this.apiService.checkNotifications();
  }

  @Get('uploadInfo')
  async getUploadInfo() {
    const filesInBuffer = await this.apiService.getUploadInfo();
    const filesAlreadyParsed = await listDir(rootPath + '/src/realData/')
    return {
      filesInBuffer,
      filesAlreadyParsed
    }
  }










  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files',
        filename: function (req, file, callback) {
          console.log(req.body);
          callback(null, file.originalname)
        },
      }),
      fileFilter: xlsxFileFilter,
    }),
  )
  async uploadedFile(@Body() category, @UploadedFile() file) {
    console.log("file")
    console.log(file)
    console.log(category.name)
    await this.apiService.createNotificationForFileChange(category.name)
    const targetFileName = mapFileNames(category.name)
    console.log(targetFileName)

    const response = {
      originalname: file.originalname,
      filename: file.filename,
    };
    return this.apiService.HandleFileUpload(file.originalname, targetFileName);
  }


}


export const xlsxFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(xlsx)$/)) {
    return callback(new Error('Only xlsx files are allowed!'), false);
  }
  callback(null, true);
};

export const mapFileNames = (fileName) => {
  switch (parseInt(fileName)) {
    case 1:
      return "budget_report.xlsx"
      break;
    case 2:
      return "KPI-report_1.xlsx"
      break;
    case 3:
      return "status_report.xlsx"
      break;
    case 4:
      return "test_data.xlsx"
      break;
    case 5:
      return "budget_past.xlsx"
      break;
    default:
      return "none"
      break;
  }
};

export const listDir = async (path) => {
  const fsPromises = fs.promises;
  try {
    return fsPromises.readdir(path);
  } catch (err) {
    console.error('Error occured while reading directory!', err);
  }
}