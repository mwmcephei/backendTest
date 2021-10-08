import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Sheet } from '../schemas/sheet.schema';
import { Measure } from '../schemas/measure.schema';
import { Artefact } from '../schemas/artefact.schema';
import { Budget } from '../schemas/budget.schema';
import { Model } from 'mongoose';
import { resolve } from 'path';
import * as XLSX from 'xlsx';
import { fileNames, FOCUS_AREA_NAMES } from '../globalVars';
import '../types';
import 'src/types';
import {
  Risk,
  SheetType,
  KPI,
  KpiProgressData,
  InitialOverview,
  Overview,
  AllBudgetMeasures,
  BudgetDetail,
  PastBudget,
} from 'src/types';

/*
Conduct one-time manual parsing by addressing api endpoints in this order:
1. .../xlsx-parser/parse
2. .../xlsx-parser/parse_overview
3. .../xlsx-parser/create_overview  
4. .../xlsx-parser/parse_kpi
5. .../xlsx-parser/parse_budget_months
6. .../xlsx-parser/parse_budget_past
*/

@Injectable()
export class XlsxParserService {
  constructor(
    @InjectModel('Artefact') private artefactModel: Model<Artefact>,
    @InjectModel('Measure') private measureModel: Model<Measure>,
    @InjectModel('Sheet') private sheetModel: Model<Sheet>,
    @InjectModel('Budget') private budgetModel: Model<Budget>,
    @InjectModel('PastBudget') private pastBudgetModel: Model<PastBudget>,
  ) { }


  async createOverview(): Promise<InitialOverview> {
    const workbookKPIFile = XLSX.readFile(
      resolve(fileNames.xlsx_file_dir, fileNames.kpi_file_1),
    );
    const workbookBudgetFile = XLSX.readFile(
      resolve(fileNames.xlsx_file_dir, fileNames.budget_file),
    );
    const workbookStatusReport = XLSX.readFile(
      resolve(fileNames.xlsx_file_dir, fileNames.status_report),
    );
    //  const KPIAsJsonObject = XLSX.utils.sheet_to_json(
    //   workbookKPIFile.Sheets[workbookKPIFile.SheetNames[0]],
    //  );
    const KPIAsJsonObject = workbookKPIFile.Sheets['Plan view'];
    const statusReportAsJsonObject = XLSX.utils.sheet_to_json(
      workbookStatusReport.Sheets[workbookStatusReport.SheetNames[0]],
    );
    const budgetReoportAsJsonObject = XLSX.utils.sheet_to_json(
      workbookBudgetFile.Sheets[workbookBudgetFile.SheetNames[0]],
    );
    //   console.log(statusReportAsJsonObject)

    const baselinDate = KPIAsJsonObject['F4'].v
    const actualsDate = KPIAsJsonObject['G4'].v
    const targetDate = KPIAsJsonObject['H4'].v
    const plan1 = KPIAsJsonObject['J4'].v
    const plan2 = KPIAsJsonObject['K4'].v
    const plan3 = KPIAsJsonObject['L4'].v

    const statusDateKey = Object.keys(statusReportAsJsonObject[3])[0]
    let statusDate = statusReportAsJsonObject[3][statusDateKey]
    if (statusDate.substring(0, 5) === "as of") {
      statusDate = statusDate.substring(6, statusDate.length)
    }
    console.log(budgetReoportAsJsonObject[0])
    console.log(budgetReoportAsJsonObject[1])
    console.log(budgetReoportAsJsonObject[2])
    console.log(budgetReoportAsJsonObject[3])
    const budgetDate = budgetReoportAsJsonObject[1]["__EMPTY_25"].split("(")[1].split(")")[0]
    //  const budgetDate = statusReportAsJsonObject[4]["__EMPTY_14"].split("(")[1].split(")")[0]
    //  const statusArtefactDate = StatusReportAsJsonObject['Y9'].v
    /*
    const baselinDate = KPIAsJsonObject[4]["__EMPTY_18"] ? KPIAsJsonObject[4]["__EMPTY_18"] : ""
    const actualsDate = KPIAsJsonObject[4]["__EMPTY_19"] ? KPIAsJsonObject[4]["__EMPTY_19"] : ""
    const targetDate = KPIAsJsonObject[4]["__EMPTY_20"] ? KPIAsJsonObject[4]["__EMPTY_20"] : ""
    const plan1 = KPIAsJsonObject[4]["__EMPTY_22"] ? KPIAsJsonObject[4]["__EMPTY_22"] : ""
    const plan2 = KPIAsJsonObject[4]["__EMPTY_23"] ? KPIAsJsonObject[4]["__EMPTY_23"] : ""
    const plan3 = KPIAsJsonObject[4]["__EMPTY_24"] ? KPIAsJsonObject[4]["__EMPTY_24"] : ""
    */
    const kpiDates = [
      baselinDate.length > 0 ? baselinDate.substring(baselinDate.length - 10, baselinDate.length) : "",
      actualsDate.length > 0 ? actualsDate.substring(actualsDate.length - 8, actualsDate.length) : "",
      targetDate.length > 0 ? targetDate.substring(targetDate.length - 10, targetDate.length) : "",
    ]
    const kpiPlans = [
      plan1.length > 0 ? plan1.substring(plan1.length - 7, plan1.length) : "",
      plan2.length > 0 ? plan2.substring(plan2.length - 7, plan2.length) : "",
      plan3.length > 0 ? plan3.substring(plan3.length - 7, plan3.length) : "",
    ]
    let result: InitialOverview;
    const excelSheet = await this.sheetModel.findOne({
      name: fileNames.main_file,
    });
    if (excelSheet) {
      const numberOfMeasures = excelSheet.measures.length;
      const workbook = XLSX.readFile(
        resolve(fileNames.xlsx_file_dir, fileNames.main_file),
      );
      const overview_object = workbook.Sheets['Status Overview'];

      // ------total budget
      let totalBudget = 0;
      const allBudgetsOfMeasures: AllBudgetMeasures[] = [];
      Object.keys(overview_object).filter((key) => {
        if (key.includes('I')) {
          // column 'I' of xlsx sheet
          const row = parseInt(key.substring(1));
          if (row > 4) {
            const measureName = overview_object['D' + row]['v'];
            const budgetAsString = overview_object[key]['v'];
            const budget = budgetAsString * 1000
            //          parseInt(
            //            budgetAsString.substring(0, budgetAsString.indexOf('k')),
            //          ) * 1000;
            totalBudget += budget;
            const currentBudget = {
              [measureName]: budget,
            };
            allBudgetsOfMeasures.push(currentBudget);
          }
        }
      });
      // ------overall status
      const allRisksBudgetsAndArtefacts = [];
      Object.keys(overview_object).filter((key) => {
        if (key.includes('P')) {
          const row = parseInt(key.substring(1));
          if (row > 4) {
            allRisksBudgetsAndArtefacts.push(overview_object[key]['v']);
          }
        }
      });
      Object.keys(overview_object).filter((key) => {
        if (key.includes('Q')) {
          const row = parseInt(key.substring(1));
          if (row > 4) {
            allRisksBudgetsAndArtefacts.push(overview_object[key]['v']);
          }
        }
      });
      Object.keys(overview_object).filter((key) => {
        if (key.includes('R')) {
          const row = parseInt(key.substring(1));
          if (row > 4) {
            allRisksBudgetsAndArtefacts.push(overview_object[key]['v']);
          }
        }
      });
      let overallStatus = 0;
      allRisksBudgetsAndArtefacts.map((a) => {
        if (a > overallStatus) {
          overallStatus = a;
        }
      });
      // ------Progress Overview:  sum over measures(avgProgress * measureBudget) / totalBudget
      // get all measures, get artefacts of each measure
      let sumAvgProgressTimesBudgetOfMEasures = 0;
      for (let m = 0; m < excelSheet.measures.length; m++) {
        const measure = await (
          await this.measureModel.findById(excelSheet.measures[m])
        )
          .populate('artefacts')
          .execPopulate();
        let avgProgressOfArtefacts = 0;
        measure.artefacts.map((art) => {
          avgProgressOfArtefacts += art.progress;
        });
        avgProgressOfArtefacts =
          avgProgressOfArtefacts / measure.artefacts.length;
        let temp = 0;
        allBudgetsOfMeasures.map((item) => {
          if (item[measure.title]) {
            if (isNaN(avgProgressOfArtefacts)) {
              temp = item[measure.title];
            } else {
              temp = item[measure.title] * avgProgressOfArtefacts;
            }
          }
        });
        sumAvgProgressTimesBudgetOfMEasures += temp;
      }
      const progressOverviewBarResult =
        sumAvgProgressTimesBudgetOfMEasures / totalBudget;

      // ------KPI Progress
      const KPIprogressOfAllMeasures =
        this.getKPIProgressData('kpi_progress.xlsx');
      let sum = 0;
      KPIprogressOfAllMeasures.map((item) => {
        allBudgetsOfMeasures.map((budgetOfMeasure) => {
          //       if (budgetOfMeasure[item.measureName]) {
          if (budgetOfMeasure[Object.keys(budgetOfMeasure)[0]]) {


            const temp = item.progress * budgetOfMeasure[Object.keys(budgetOfMeasure)[0]];
            sum += temp;
          }
        });
      });
      const KPIProgressResult = sum / totalBudget;
      const updatedSheet = await excelSheet.update({
        kpiPlans,
        kpiDates,
        totalBudget: totalBudget,
        overallStatus: overallStatus,
        progress: Math.round(progressOverviewBarResult * 100) / 100,
        kpiProgress: Math.round(KPIProgressResult * 100) / 100,
        statusDate,
        budgetDate
      });

      result = {
        numberOfMeasures,
        totalBudget,
        overallStatus,
        progressOverviewBarResult,
        KPIProgressResult,
        statusDate,
        budgetDate
      };

    }
    return result;
  }

  // aux function for createOverview()
  getKPIProgressData(kpiFile: string): KpiProgressData[] {
    const workbook = XLSX.readFile(resolve(fileNames.xlsx_file_dir, kpiFile));
    const overview_object = workbook.Sheets['Plan view'];
    // D:measure name, G current progress, H target progress
    const numberOfRows = 22; // TO DO: get number of rows programmatically    ---   22
    const result: KpiProgressData[] = [];
    for (let i = 1; i <= numberOfRows; i++) {
      const keyMeasureName = 'D' + (4 + i); // first entry at row 4
      const keyActualProgress = 'G' + (4 + i);
      const keyTargetProgress = 'H' + (4 + i);
      result.push({
        measureName: overview_object[keyMeasureName]['v'],
        progress:
          Math.round(
            (overview_object[keyActualProgress]['v'] /
              overview_object[keyTargetProgress]['v']) *
            100,
          ) / 100,
      });
    }
    return result;
  }

  // parse and save measures and corresponding artefacts
  parse(): string {
    const focusAreaNames: { [key: string]: string } = {
      //   'Slow down hackers': 'SH',
      'Slow Down Hackers': 'SH',
      //  'Increase detection': 'ID',
      'Increase Detection': 'ID',
      //    'Reduce damage': 'RD',
      'Reduce Damage': 'RD',
      //   'Streamline compliance': 'SC',
      'Streamline Compliance': 'SC',
      //  'Build Security org/skills': 'BS',
      'Build Security Organization / Skills': 'BS',

    };
    // create Sheet Table
    const newSheet = {
      name: fileNames.main_file,
    };
    const excelFile = new this.sheetModel(newSheet);
    excelFile.save().then((newlySavedExcelSheet) => {
      // get raw data from files
      const workbook = XLSX.readFile(
        resolve(fileNames.xlsx_file_dir, fileNames.main_file),
      );
      const workbookStatusReportFile = XLSX.readFile(
        resolve(fileNames.xlsx_file_dir, fileNames.status_report),
      );
      const workbookBudgetFile = XLSX.readFile(
        resolve(fileNames.xlsx_file_dir, fileNames.budget_file),
      );
      const statusReportAsJsonObject = XLSX.utils.sheet_to_json(
        workbookStatusReportFile.Sheets[workbookStatusReportFile.SheetNames[0]],
      );
      const budgetFileAsJsonObject = XLSX.utils.sheet_to_json(
        workbookBudgetFile.Sheets['1. Overview'],
      );
      const budgetDetailsFileAsJsonObject =
        workbookBudgetFile.Sheets['2. Detailed view'];
      const kpiWorkbook = XLSX.readFile(
        resolve(fileNames.xlsx_file_dir, fileNames.kpi_file_1),
      );
      const kpiFileAsJsonObject = kpiWorkbook.Sheets['Plan view'];
      // 'sheet' here means a sheet of the xlsx file i.e. a measure "M...""
      const sheet_name_list = workbook.SheetNames;
      sheet_name_list.map((sheetName) => {
        // save measure to DB
        if (sheetName !== 'Status Overview' && sheetName !== 'Overview') {
          // get month columns EUR1 EUR2 .... row 12
          const month_columns = [];
          Object.keys(budgetDetailsFileAsJsonObject).map((key) => {
            const tmp = key.replace(/^[A-Z]/, '_');
            const split = tmp.split('_');
            const target = split[split.length - 1];
            if (parseInt(target) == 12) {
              const x = budgetDetailsFileAsJsonObject[key]['v'];
              if (x.substring(0, 3) === 'EUR' && x.length < 5) {
                month_columns.push(key.substring(0, key.length - 2));
              }
            }
          });
          //  month_columns = [ 'M', 'O', 'Q', 'S', 'U', 'W' ]   columns of months in "Detailed view"
          const monthlySpendings = month_columns.map((month) => {
            let sumOfThisMonth = 0;
            Object.keys(budgetDetailsFileAsJsonObject).map((key) => {
              if (key.substring(0, 1) === 'C') {
                if (budgetDetailsFileAsJsonObject[key]['v'] === sheetName) {
                  const rowNr = key.substring(1, key.length);
                  if (budgetDetailsFileAsJsonObject[month + rowNr]) {
                    if (budgetDetailsFileAsJsonObject[month + rowNr]['v']) {
                      //      console.log(budgetDetailsFileAsJsonObject[month + rowNr]["v"])
                      sumOfThisMonth =
                        sumOfThisMonth +
                        budgetDetailsFileAsJsonObject[month + rowNr]['v'];
                    }
                  }
                }
              }
            });
            return sumOfThisMonth;
          });
          let kpiData: KPI = {
            target: 0,
            actuals: 0,
            baseline: 0,
            plan1: 0,
            plan2: 0,
            plan3: 0,
            plan4: 0,
          };
          Object.keys(kpiFileAsJsonObject).map((key) => {
            if (key.includes('D')) {
              const row = parseInt(key.substring(1));
              if (row > 4) {
                if (kpiFileAsJsonObject[key].v === sheetName) {
                  kpiData.baseline = kpiFileAsJsonObject['F' + row].v;
                  kpiData.actuals = kpiFileAsJsonObject['G' + row].v;
                  kpiData.target = kpiFileAsJsonObject['H' + row].v;
                  kpiData.plan1 = kpiFileAsJsonObject['J' + row].v;
                  kpiData.plan2 = kpiFileAsJsonObject['K' + row].v;
                  kpiData.plan3 = kpiFileAsJsonObject['L' + row].v;
                  kpiData.plan4 = kpiFileAsJsonObject['M' + row].v;
                }
              }
            }
          });
          let totalApprovedBudget = 0;
          let spentBudget = 0;
          let invoicedBudget = 0;
          let forecastBudget = 0;
          let contractBudget = 0;
          for (let i = 0; i < budgetFileAsJsonObject.length; i++) {
            if (budgetFileAsJsonObject[i]['__EMPTY_1'] === sheetName) {
              totalApprovedBudget = budgetFileAsJsonObject[i]['__EMPTY_10']
                ? budgetFileAsJsonObject[i]['__EMPTY_10']
                : 0;
              spentBudget = budgetFileAsJsonObject[i]['__EMPTY_15']
                ? budgetFileAsJsonObject[i]['__EMPTY_15']
                : 0;
              invoicedBudget = budgetFileAsJsonObject[i]['__EMPTY_26']
                ? budgetFileAsJsonObject[i]['__EMPTY_26']
                : 0;
              contractBudget = budgetFileAsJsonObject[i]['__EMPTY_26']
                ? budgetFileAsJsonObject[i]['__EMPTY_27']
                : 0;
              forecastBudget = budgetFileAsJsonObject[i]['__EMPTY_28']
                ? budgetFileAsJsonObject[i]['__EMPTY_28']
                : 0;
            }
          }
          const budgetDetail: BudgetDetail = {
            totalApprovedBudget,
            spentBudget,
            invoicedBudget,
            contractBudget,
            forecastBudget,
          };
          const xlsxFileAsJsonObject: SheetType[] = XLSX.utils.sheet_to_json(
            workbook.Sheets[sheetName],
          );
          let id: number;
          let measureLead: string;
          let measureSponsor: string;
          let lineOrgSponsor: string;
          let solutionManager: string;
          let approved: number //| string;    ////////
          let spent: number;
          let kpiName: string;
          let actuals: number;
          let target: number //| string;    ////////
          let description: string;
          for (let i = 0; i < statusReportAsJsonObject.length; i++) {
            if (statusReportAsJsonObject[i]['__EMPTY_1'] === sheetName) {
              const firstKey = Object.keys(statusReportAsJsonObject[i])[0];
              id = statusReportAsJsonObject[i][firstKey];
              description = statusReportAsJsonObject[i]['__EMPTY_4'] ? statusReportAsJsonObject[i]['__EMPTY_4'] : ""
              measureLead = statusReportAsJsonObject[i]['__EMPTY_10'] ? statusReportAsJsonObject[i]['__EMPTY_10'] : ""
              measureSponsor = statusReportAsJsonObject[i]['__EMPTY_9'] ? measureSponsor = statusReportAsJsonObject[i]['__EMPTY_9'] : ""
              lineOrgSponsor = statusReportAsJsonObject[i]['__EMPTY_12'] ? statusReportAsJsonObject[i]['__EMPTY_12'] : ""
              solutionManager = statusReportAsJsonObject[i]['__EMPTY_13'] ? statusReportAsJsonObject[i]['__EMPTY_13'] : ""
              kpiName = statusReportAsJsonObject[i]['__EMPTY_21'] ? statusReportAsJsonObject[i]['__EMPTY_21'] : ""
              approved = statusReportAsJsonObject[i]['__EMPTY_14'];
              spent = statusReportAsJsonObject[i]['__EMPTY_18'] ? statusReportAsJsonObject[i]['__EMPTY_18'].toFixed(2) : 0
              actuals = statusReportAsJsonObject[i]['__EMPTY_23'] ? statusReportAsJsonObject[i]['__EMPTY_23'] : 0
              target = statusReportAsJsonObject[i]['__EMPTY_24'] ? statusReportAsJsonObject[i]['__EMPTY_24'] : 0
            }
          }
          // get risks
          const risks: Risk[] = [];
          for (let x = 0; x < xlsxFileAsJsonObject.length; x++) {
            if (
              xlsxFileAsJsonObject[x]['__EMPTY_2'] ===
              'KPI Description (Actuals/Target)'
            ) {
              let risk1: Risk = {
                risk: '',
                description: '',
                criticality: '',
                migration: '',
                resolutionDate: '',
              };
              risk1.risk = xlsxFileAsJsonObject[x]['__EMPTY_8'] ?? '';
              risk1.description = xlsxFileAsJsonObject[x]['__EMPTY_10'] ?? '';
              risk1.criticality = xlsxFileAsJsonObject[x]['__EMPTY_17'] ?? '';
              risk1.migration = xlsxFileAsJsonObject[x]['__EMPTY_19'] ?? '';
              risk1.resolutionDate =
                xlsxFileAsJsonObject[x]['__EMPTY_25'] ?? '';
              risks.push(risk1);
              if (xlsxFileAsJsonObject[x + 3]['__EMPTY_8']) {
                let risk2: Risk = {
                  risk: '',
                  description: '',
                  criticality: '',
                  migration: '',
                  resolutionDate: '',
                };
                risk2.risk = xlsxFileAsJsonObject[x + 3]['__EMPTY_8'] ?? '';
                risk2.description =
                  xlsxFileAsJsonObject[x + 3]['__EMPTY_10'] ?? '';
                risk2.criticality =
                  xlsxFileAsJsonObject[x + 3]['__EMPTY_17'] ?? '';
                risk2.migration =
                  xlsxFileAsJsonObject[x + 3]['__EMPTY_19'] ?? '';
                risk2.resolutionDate =
                  xlsxFileAsJsonObject[x + 3]['__EMPTY_25'] ?? '';
                risks.push(risk2);
                if (xlsxFileAsJsonObject[x + 6]['__EMPTY_8']) {
                  let risk3: Risk = {
                    risk: '',
                    description: '',
                    criticality: '',
                    migration: '',
                    resolutionDate: '',
                  };
                  risk3.risk = xlsxFileAsJsonObject[x + 6]['__EMPTY_8'] ?? '';
                  risk3.risk = xlsxFileAsJsonObject[x + 6]['__EMPTY_10'] ?? '';
                  risk3.risk = xlsxFileAsJsonObject[x + 6]['__EMPTY_17'] ?? '';
                  risk3.risk = xlsxFileAsJsonObject[x + 6]['__EMPTY_19'] ?? '';
                  risk3.risk = xlsxFileAsJsonObject[x + 6]['__EMPTY_25'] ?? '';
                  risks.push(risk3);
                }
              }
            }
          }
          const newMeasure = {
            kpiData,
            id,
            title: sheetName,
            name: xlsxFileAsJsonObject[3]['__EMPTY_1'],
            description,
            time: xlsxFileAsJsonObject[3]['__EMPTY_19'],
            lastUpdate: xlsxFileAsJsonObject[3]['__EMPTY_24'],
            focusArea: focusAreaNames[xlsxFileAsJsonObject[3]['__EMPTY_8']],
            focusAreaFull: xlsxFileAsJsonObject[3]['__EMPTY_8'],
            measureLead,
            measureSponsor,
            lineOrgSponsor,
            solutionManager,
            approved,
            spent,
            kpiName,
            actuals,
            target,
            risks,
            budgetDetail,
            monthlySpendings,
          };
          const measure = new this.measureModel(newMeasure);
          measure
            .save()
            .then(async (savedMeasure) => {
              // add measure to ExcelSheet measure list
              await this.sheetModel.updateOne(
                { _id: newlySavedExcelSheet._id },
                { $push: { measures: savedMeasure } },
              );
              return savedMeasure;
            })
            .then(async (savedMeasure) => {
              // get artefacts of this measure and add it to measure in DB
              const artefacts =
                this.getArtefactsFromLinesArray(xlsxFileAsJsonObject);

              const savedArtefact_IDs = [];
              artefacts.map((art) => {
                // artefacts: array of objects, each containing a row of xlsx file
                const toSave = {
                  id: art['__EMPTY_1'], // __EMPTY_ + column(!) number accesses a cell
                  description: art['__EMPTY_2'],
                  progress: art['__EMPTY_9'],
                  budget: art['__EMPTY_11'] ? art['__EMPTY_11'] : '',
                  achievement: art['__EMPTY_13'],
                  work: art['__EMPTY_21'],
                };
                const artefact = new this.artefactModel(toSave);
                artefact
                  .save()
                  .then(async (savedArtefact) => {
                    savedArtefact_IDs.push(savedArtefact._id);
                    await this.measureModel.updateOne(
                      { _id: savedMeasure._id },
                      { $push: { artefacts: savedArtefact } },
                    );
                  })
                  .catch((err) => console.log(err));
              });
            })
            .catch((err) => console.log(err));
        }
      });
    });
    return 'measures & artefacts parsed and saved to DB';
  }

  // aux functions for parse()
  getArtefactsFromLinesArray(sheet: SheetType[]): SheetType[] {
    return sheet.filter((line) => {
      const firstKey = Object.keys(line)[0];
      if (firstKey === '__EMPTY_1') {
        const firstItem = `${line[firstKey]}`;
        try {
          if (parseInt(firstItem) < 10 && Object.keys(line).length > 2) {
            return line;
          }
        } catch (e) {
          console.log(e);
        }
      }
    });
  }



  // adds status info to measures
  parse_overview() {
    const workbook = XLSX.readFile(
      resolve(fileNames.xlsx_file_dir, fileNames.main_file),
    );
    // parse overview
    const overview_object = workbook.Sheets['Status Overview'];
    const risks = []; // RESTRUCTURE!!!!!!!
    Object.keys(overview_object).filter((key) => {
      if (key.includes('P')) {
        const row = parseInt(key.substring(1));
        if (row > 4) {
          risks.push({
            row,
            risk: overview_object[key]['v'],
          });
        }
      }
    });
    const budgets = [];
    Object.keys(overview_object).filter((key) => {
      if (key.includes('Q')) {
        const row = parseInt(key.substring(1));
        if (row > 4) {
          budgets.push({
            row,
            budget: overview_object[key]['v'],
          });
        }
      }
    });
    const artefacts = [];
    Object.keys(overview_object).filter((key) => {
      if (key.includes('R')) {
        const row = parseInt(key.substring(1));
        if (row > 4) {
          artefacts.push({
            row,
            artefact: overview_object[key]['v'],
          });
        }
      }
    });
    const result = [];
    Object.keys(overview_object).filter(async (key) => {
      if (key.includes('D')) {
        const row = parseInt(key.substring(1));
        if (row > 4) {
          const addToResult = {
            row,
            name: overview_object[key]['h'],
            risk: risks[row - 5]['risk'],
            budget: budgets[row - 5]['budget'],
            artefact: artefacts[row - 5]['artefact'],
          };
          result.push(addToResult);
          await this.measureModel.updateOne(
            { title: addToResult.name },
            {
              risk: addToResult.risk,
              budget: addToResult.budget,
              artefact: addToResult.artefact,
            },
          );
        }
      }
    });
  }




  async parseKPI(): Promise<string> {
    const workbook = XLSX.readFile(
      resolve(fileNames.xlsx_file_dir, fileNames.kpi_file_1),
    );
    const overview_object = workbook.Sheets['Plan view'];
    // get row number of measures. measure names in column "D"
    const rowsOfMeasures = [];
    Object.keys(overview_object).filter((key) => {
      if (key.includes('D')) {
        const row = parseInt(key.substring(1));
        if (row > 4) {
          rowsOfMeasures.push({
            measureName: overview_object[key]['v'],
            row,
          });
        }
      }
    });
    // get measures from DB
    const measures = await this.measureModel.find();
    measures.map(async (measure) => {
      let rowOfThisMeasure;
      for (let i = 0; i < rowsOfMeasures.length; i++) {
        if (rowsOfMeasures[i].measureName === measure.title) {
          rowOfThisMeasure = rowsOfMeasures[i].row;
        }
      }
      // from row get actual, target, plan of last month
      // G, H and J ???
      let actuals;
      let target;
      let lastPlan;
      Object.keys(overview_object).filter((key) => {
        if (key.includes('G')) {
          const row = parseInt(key.substring(1));
          if (row == rowOfThisMeasure) {
            console.log("----------------")
            console.log(overview_object[key])
            console.log()
            console.log("----------------")
            actuals = overview_object[key]['v'];
          }
        }
        if (key.includes('H')) {
          const row = parseInt(key.substring(1));
          if (row == rowOfThisMeasure) {
            target = overview_object[key]['v'];
          }
        }
        if (key.includes('L')) {
          // TO DO: clarify which last month
          const row = parseInt(key.substring(1));
          if (row == rowOfThisMeasure) {
            lastPlan = overview_object[key]['v'];
          }
        }
      });
      console.log(
        measure.title + '  ' + actuals + '  ' + target + '  ' + lastPlan,
      );
      let kpiProgressOfThisMeasure;
      if (actuals < lastPlan) {
        kpiProgressOfThisMeasure = 1 ////     0; // behind schedule             HARDCODED
      } else if (lastPlan <= actuals && actuals < target) {
        kpiProgressOfThisMeasure = 1; // on schedule
      } else if (actuals >= target) {
        kpiProgressOfThisMeasure = 2; // finished
      }
      const updatedMeasure = await measure.update({
        kpiProgress: kpiProgressOfThisMeasure,
      });
      if (updatedMeasure) {
        console.log('updated');
        console.log(updatedMeasure);
      }
    });
    return 'ok';
  }

  async parseBudgetMonths(): Promise<string> {
    const workbook = XLSX.readFile(
      resolve(fileNames.xlsx_file_dir, fileNames.budget_file),
    );
    const overview_object = workbook.Sheets['1. Overview'];
    const detailes_object = workbook.Sheets['2. Detailed view'];
    // M > 5,  D measure names
    // M 29 grand total approved budget

    ///////// TO DO: dynamically get line of totalApprovedBudget !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    const totalApprovedBudget = overview_object['M36']['v'];

    // get month columns EUR1 EUR2 .... row 12
    const month_columns = [];
    Object.keys(detailes_object).map((key) => {
      const tmp = key.replace(/^[A-Z]/, '_');
      const split = tmp.split('_');
      const target = split[split.length - 1];
      if (parseInt(target) == 12) {
        const x = detailes_object[key]['v'];
        if (x.substring(0, 3) === 'EUR' && x.length < 5) {
          month_columns.push(key.substring(0, key.length - 2));
        }
      }
    });
    //  month_columns = [ 'M', 'O', 'Q', 'S', 'U', 'W' ]   columns of months in "Detailed view"
    const sumRow = 281 //286; // sum of all measures spent budget per month in this row in "Detailed view"  HARDCODED
    const monthlySpendings = month_columns.map((month, index) => {
      return Math.round(detailes_object[month + '' + sumRow]['v'] * 100) / 100;     // M286
    });
    const approvedBudgetPerMonth =
      Math.round((totalApprovedBudget / month_columns.length) * 100) / 100;
    const year = new Date().getFullYear(); // TO DO: year is currently assumed to be this year (Datetime). Improve by parsing from file
    const newBudget = new this.budgetModel({
      monthlySpendings,
      approvedBudgetPerMonth,
      year,
    });
    newBudget.save().then((result) => {
      console.log('budget saved');
    });
    const excelSheet = await this.sheetModel.findOne({
      name: fileNames.main_file,
    });
    excelSheet
      .update({ totalBudget: totalApprovedBudget })
      .then((result) => {
        console.log(result);
      })
      .catch((e) => {
        console.log(e);
      });
    return 'budget parsed';
  }

  budgetStringToNumber(input) {
    let result = '';
    const temp = input.substring(1, input.length - 3);
    if (temp.includes(',')) {
      const index = temp.indexOf(',');
      result = temp.substring(0, index) + temp.substring(index + 1);
    } else if (temp.includes('.')) {
      const index = temp.indexOf('.');
      result = temp.substring(0, index) + temp.substring(index + 1);
    } else if (temp.includes('-')) {
      result = '0';
    }
    return parseInt(result);
  }


  async parseBudgetPast() {
    const workbookBudgetPastFile = XLSX.readFile(
      resolve(fileNames.xlsx_file_dir, fileNames.budget_past),
    );
    const budgetPastAsJsonObject = workbookBudgetPastFile.Sheets["Measure Overview"];
    // B, E, F
    const result: PastBudget[] = []
    let rowPosition = 6
    let currentYear = 0
    while (budgetPastAsJsonObject["B" + rowPosition]) {
      if ((budgetPastAsJsonObject["B" + rowPosition].v + "").substring(0, 1) === "M") {
        const pastBudget: PastBudget = {
          title: budgetPastAsJsonObject["B" + rowPosition].v,
          name: budgetPastAsJsonObject["C" + rowPosition].v,
          budget: budgetPastAsJsonObject["E" + rowPosition].v,
          category: budgetPastAsJsonObject["F" + rowPosition].v,
          year: currentYear
        }
        result.push(pastBudget)
        const pastBudgetToDB = new this.pastBudgetModel(pastBudget);
        await pastBudgetToDB.save()

      } else if ((budgetPastAsJsonObject["B" + rowPosition].v + "").substring(0, 1) === "2") {
        currentYear = budgetPastAsJsonObject["B" + rowPosition].v
      }
      rowPosition++
    }
    return result
  }
}
