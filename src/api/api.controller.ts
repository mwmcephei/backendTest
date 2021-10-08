import { Controller, Get, Post, Param, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiService } from './api.service';
import { Express } from 'express'
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Notification } from '../schemas/notification.schema';
import { NotificationStatus } from '../schemas/notificationStatus.schema';


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




  @Get("getNotifications")
  getNotifications() {
    return this.apiService.getNotifications();
  }

  @Get("lookAtNotifications")
  lookAtNotifications() {
    return this.apiService.lookAtNotifications();
  }

  @Post("setNotification")
  async setNotification(@Body() notification: SetNotificationDto) {
    console.log("NOTIFICATIONNNNN")
    console.log(notification)
    return this.apiService.setNotification(notification);
  }

  @Get('checkNotifications')
  checkNotifications() {
    return this.apiService.checkNotifications();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: "./uploads",
      filename: editFileName
    })
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {

    console.log(file);
    return this.apiService.filesChanged();
  }


}





export const editFileName = (req, file, callback) => {
  //   const name = file.originalname.split('.')[0];
  const name = file.originalname
  //  const fileExtName = extname(file.originalname);
  //  const randomName = Array(4)
  //   .fill(null)
  //   .map(() => Math.round(Math.random() * 16).toString(16))
  //   .join('');
  // callback(null, `${name}-${randomName}${fileExtName}`);
  callback(null, `${name}`);
};