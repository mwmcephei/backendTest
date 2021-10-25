import { Controller, Get, Param } from '@nestjs/common';
import { XlsxParserService } from './xlsx-parser.service';

@Controller('xlsx-parser')
export class XlsxParserController {
  constructor(private xlsxParseService: XlsxParserService) { }

  // routes for creating data
  //
  @Get('parse/:temp')
  parse(@Param() params) {
    console.log('parse');
    const tempAsBool = (params.temp === 'true')
    return this.xlsxParseService.parse(tempAsBool);
  }

  @Get('parse_overview/:temp')
  parse_overview(@Param() params) {
    console.log('parse_overview');
    const tempAsBool = (params.temp === 'true')
    return this.xlsxParseService.parse_overview(tempAsBool);
  }

  @Get('create_overview/:temp')
  triggerOverviewCreation(@Param() params) {
    console.log('createOverview');
    const tempAsBool = (params.temp === 'true')
    return this.xlsxParseService.createOverview(tempAsBool);
  }

  @Get('parse_kpi/:temp')
  parseKPI(@Param() params) {
    console.log('parse_kpi');
    const tempAsBool = (params.temp === 'true')
    return this.xlsxParseService.parseKPI(tempAsBool);
  }

  @Get('parse_budget_months/:temp')
  parseBudgetMonths(@Param() params) {
    console.log('parse_budget_months');
    const tempAsBool = (params.temp === 'true')
    return this.xlsxParseService.parseBudgetMonths(tempAsBool);
  }

  @Get('parse_budget_past')
  parseBudgetPast() {
    return this.xlsxParseService.parseBudgetPast();
  }



  @Get('triggerParsing')
  triggerParsing() {
    return this.xlsxParseService.triggerParsing();
  }

  @Get('parseManually/:temp')
  parseManually(@Param() params) {
    const tempAsBool = (params.temp === 'true')
    return this.xlsxParseService.parseAll(tempAsBool);
  }

  @Get('deleteData/:temp')
  async deleteData(@Param() params) {
    const tempAsBool = (params.temp === 'true')
    return await this.xlsxParseService.deleteData(tempAsBool);
  }



}
