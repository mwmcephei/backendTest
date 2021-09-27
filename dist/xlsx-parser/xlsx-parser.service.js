"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.XlsxParserService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const path_1 = require("path");
const XLSX = require("xlsx");
const globalVars_1 = require("../globalVars");
require("../types");
require("../types");
const types_1 = require("../types");
let XlsxParserService = class XlsxParserService {
    constructor(artefactModel, measureModel, sheetModel, budgetModel, pastBudgetModel) {
        this.artefactModel = artefactModel;
        this.measureModel = measureModel;
        this.sheetModel = sheetModel;
        this.budgetModel = budgetModel;
        this.pastBudgetModel = pastBudgetModel;
    }
    async createOverview() {
        const workbookKPIFile = XLSX.readFile(path_1.resolve(globalVars_1.fileNames.xlsx_file_dir, globalVars_1.fileNames.kpi_file_1));
        const workbookBudgetFile = XLSX.readFile(path_1.resolve(globalVars_1.fileNames.xlsx_file_dir, globalVars_1.fileNames.budget_file));
        const workbookStatusReport = XLSX.readFile(path_1.resolve(globalVars_1.fileNames.xlsx_file_dir, globalVars_1.fileNames.status_report));
        const KPIAsJsonObject = workbookKPIFile.Sheets['Plan view'];
        const statusReportAsJsonObject = XLSX.utils.sheet_to_json(workbookStatusReport.Sheets[workbookStatusReport.SheetNames[0]]);
        const baselinDate = KPIAsJsonObject['F4'].v;
        const actualsDate = KPIAsJsonObject['G4'].v;
        const targetDate = KPIAsJsonObject['H4'].v;
        const plan1 = KPIAsJsonObject['J4'].v;
        const plan2 = KPIAsJsonObject['K4'].v;
        const plan3 = KPIAsJsonObject['L4'].v;
        const statusDateKey = Object.keys(statusReportAsJsonObject[3])[0];
        let statusDate = statusReportAsJsonObject[3][statusDateKey];
        if (statusDate.substring(0, 5) === "as of") {
            statusDate = statusDate.substring(6, statusDate.length);
        }
        const budgetDate = statusReportAsJsonObject[4]["__EMPTY_14"].split("(")[1].split(")")[0];
        const kpiDates = [
            baselinDate.length > 0 ? baselinDate.substring(baselinDate.length - 10, baselinDate.length) : "",
            actualsDate.length > 0 ? actualsDate.substring(actualsDate.length - 8, actualsDate.length) : "",
            targetDate.length > 0 ? targetDate.substring(targetDate.length - 10, targetDate.length) : "",
        ];
        const kpiPlans = [
            plan1.length > 0 ? plan1.substring(plan1.length - 7, plan1.length) : "",
            plan2.length > 0 ? plan2.substring(plan2.length - 7, plan2.length) : "",
            plan3.length > 0 ? plan3.substring(plan3.length - 7, plan3.length) : "",
        ];
        let result;
        const excelSheet = await this.sheetModel.findOne({
            name: globalVars_1.fileNames.main_file,
        });
        if (excelSheet) {
            const numberOfMeasures = excelSheet.measures.length;
            const workbook = XLSX.readFile(path_1.resolve(globalVars_1.fileNames.xlsx_file_dir, globalVars_1.fileNames.main_file));
            const overview_object = workbook.Sheets['Status Overview'];
            let totalBudget = 0;
            const allBudgetsOfMeasures = [];
            Object.keys(overview_object).filter((key) => {
                if (key.includes('I')) {
                    const row = parseInt(key.substring(1));
                    if (row > 4) {
                        const measureName = overview_object['D' + row]['v'];
                        const budgetAsString = overview_object[key]['v'];
                        const budget = budgetAsString * 1000;
                        totalBudget += budget;
                        const currentBudget = {
                            [measureName]: budget,
                        };
                        allBudgetsOfMeasures.push(currentBudget);
                    }
                }
            });
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
            let sumAvgProgressTimesBudgetOfMEasures = 0;
            for (let m = 0; m < excelSheet.measures.length; m++) {
                const measure = await (await this.measureModel.findById(excelSheet.measures[m]))
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
                        }
                        else {
                            temp = item[measure.title] * avgProgressOfArtefacts;
                        }
                    }
                });
                sumAvgProgressTimesBudgetOfMEasures += temp;
            }
            const progressOverviewBarResult = sumAvgProgressTimesBudgetOfMEasures / totalBudget;
            const KPIprogressOfAllMeasures = this.getKPIProgressData('kpi_progress.xlsx');
            let sum = 0;
            KPIprogressOfAllMeasures.map((item) => {
                allBudgetsOfMeasures.map((budgetOfMeasure) => {
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
    getKPIProgressData(kpiFile) {
        const workbook = XLSX.readFile(path_1.resolve(globalVars_1.fileNames.xlsx_file_dir, kpiFile));
        const overview_object = workbook.Sheets['Plan view'];
        const numberOfRows = 22;
        const result = [];
        for (let i = 1; i <= numberOfRows; i++) {
            const keyMeasureName = 'D' + (4 + i);
            const keyActualProgress = 'G' + (4 + i);
            const keyTargetProgress = 'H' + (4 + i);
            result.push({
                measureName: overview_object[keyMeasureName]['v'],
                progress: Math.round((overview_object[keyActualProgress]['v'] /
                    overview_object[keyTargetProgress]['v']) *
                    100) / 100,
            });
        }
        return result;
    }
    parse() {
        const focusAreaNames = {
            'Slow Down Hackers': 'SH',
            'Increase Detection': 'ID',
            'Reduce Damage': 'RD',
            'Streamline Compliance': 'SC',
            'Build Security Organization / Skills': 'BS',
        };
        const newSheet = {
            name: globalVars_1.fileNames.main_file,
        };
        const excelFile = new this.sheetModel(newSheet);
        excelFile.save().then((newlySavedExcelSheet) => {
            const workbook = XLSX.readFile(path_1.resolve(globalVars_1.fileNames.xlsx_file_dir, globalVars_1.fileNames.main_file));
            const workbookStatusReportFile = XLSX.readFile(path_1.resolve(globalVars_1.fileNames.xlsx_file_dir, globalVars_1.fileNames.status_report));
            const workbookBudgetFile = XLSX.readFile(path_1.resolve(globalVars_1.fileNames.xlsx_file_dir, globalVars_1.fileNames.budget_file));
            const statusReportAsJsonObject = XLSX.utils.sheet_to_json(workbookStatusReportFile.Sheets[workbookStatusReportFile.SheetNames[0]]);
            const budgetFileAsJsonObject = XLSX.utils.sheet_to_json(workbookBudgetFile.Sheets['1. Overview']);
            const budgetDetailsFileAsJsonObject = workbookBudgetFile.Sheets['2. Detailed view'];
            const kpiWorkbook = XLSX.readFile(path_1.resolve(globalVars_1.fileNames.xlsx_file_dir, globalVars_1.fileNames.kpi_file_1));
            const kpiFileAsJsonObject = kpiWorkbook.Sheets['Plan view'];
            const sheet_name_list = workbook.SheetNames;
            sheet_name_list.map((sheetName) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
                if (sheetName !== 'Status Overview' && sheetName !== 'Overview') {
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
                    const monthlySpendings = month_columns.map((month) => {
                        let sumOfThisMonth = 0;
                        Object.keys(budgetDetailsFileAsJsonObject).map((key) => {
                            if (key.substring(0, 1) === 'C') {
                                if (budgetDetailsFileAsJsonObject[key]['v'] === sheetName) {
                                    const rowNr = key.substring(1, key.length);
                                    if (budgetDetailsFileAsJsonObject[month + rowNr]) {
                                        if (budgetDetailsFileAsJsonObject[month + rowNr]['v']) {
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
                    let kpiData = {
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
                    const budgetDetail = {
                        totalApprovedBudget,
                        spentBudget,
                        invoicedBudget,
                        contractBudget,
                        forecastBudget,
                    };
                    const xlsxFileAsJsonObject = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
                    let id;
                    let measureLead;
                    let measureSponsor;
                    let lineOrgSponsor;
                    let solutionManager;
                    let approved;
                    let spent;
                    let kpiName;
                    let actuals;
                    let target;
                    let description;
                    for (let i = 0; i < statusReportAsJsonObject.length; i++) {
                        if (statusReportAsJsonObject[i]['__EMPTY_1'] === sheetName) {
                            const firstKey = Object.keys(statusReportAsJsonObject[i])[0];
                            id = statusReportAsJsonObject[i][firstKey];
                            description = statusReportAsJsonObject[i]['__EMPTY_4'] ? statusReportAsJsonObject[i]['__EMPTY_4'] : "";
                            measureLead = statusReportAsJsonObject[i]['__EMPTY_10'] ? statusReportAsJsonObject[i]['__EMPTY_10'] : "";
                            measureSponsor = statusReportAsJsonObject[i]['__EMPTY_9'] ? measureSponsor = statusReportAsJsonObject[i]['__EMPTY_9'] : "";
                            lineOrgSponsor = statusReportAsJsonObject[i]['__EMPTY_12'] ? statusReportAsJsonObject[i]['__EMPTY_12'] : "";
                            solutionManager = statusReportAsJsonObject[i]['__EMPTY_13'] ? statusReportAsJsonObject[i]['__EMPTY_13'] : "";
                            kpiName = statusReportAsJsonObject[i]['__EMPTY_21'] ? statusReportAsJsonObject[i]['__EMPTY_21'] : "";
                            approved = statusReportAsJsonObject[i]['__EMPTY_14'];
                            spent = statusReportAsJsonObject[i]['__EMPTY_18'] ? statusReportAsJsonObject[i]['__EMPTY_18'].toFixed(2) : 0;
                            actuals = statusReportAsJsonObject[i]['__EMPTY_23'] ? statusReportAsJsonObject[i]['__EMPTY_23'] : 0;
                            target = statusReportAsJsonObject[i]['__EMPTY_24'] ? statusReportAsJsonObject[i]['__EMPTY_24'] : 0;
                        }
                    }
                    const risks = [];
                    for (let x = 0; x < xlsxFileAsJsonObject.length; x++) {
                        if (xlsxFileAsJsonObject[x]['__EMPTY_2'] ===
                            'KPI Description (Actuals/Target)') {
                            let risk1 = {
                                risk: '',
                                description: '',
                                criticality: '',
                                migration: '',
                                resolutionDate: '',
                            };
                            risk1.risk = (_a = xlsxFileAsJsonObject[x]['__EMPTY_8']) !== null && _a !== void 0 ? _a : '';
                            risk1.description = (_b = xlsxFileAsJsonObject[x]['__EMPTY_10']) !== null && _b !== void 0 ? _b : '';
                            risk1.criticality = (_c = xlsxFileAsJsonObject[x]['__EMPTY_17']) !== null && _c !== void 0 ? _c : '';
                            risk1.migration = (_d = xlsxFileAsJsonObject[x]['__EMPTY_19']) !== null && _d !== void 0 ? _d : '';
                            risk1.resolutionDate =
                                (_e = xlsxFileAsJsonObject[x]['__EMPTY_25']) !== null && _e !== void 0 ? _e : '';
                            risks.push(risk1);
                            if (xlsxFileAsJsonObject[x + 3]['__EMPTY_8']) {
                                let risk2 = {
                                    risk: '',
                                    description: '',
                                    criticality: '',
                                    migration: '',
                                    resolutionDate: '',
                                };
                                risk2.risk = (_f = xlsxFileAsJsonObject[x + 3]['__EMPTY_8']) !== null && _f !== void 0 ? _f : '';
                                risk2.description =
                                    (_g = xlsxFileAsJsonObject[x + 3]['__EMPTY_10']) !== null && _g !== void 0 ? _g : '';
                                risk2.criticality =
                                    (_h = xlsxFileAsJsonObject[x + 3]['__EMPTY_17']) !== null && _h !== void 0 ? _h : '';
                                risk2.migration =
                                    (_j = xlsxFileAsJsonObject[x + 3]['__EMPTY_19']) !== null && _j !== void 0 ? _j : '';
                                risk2.resolutionDate =
                                    (_k = xlsxFileAsJsonObject[x + 3]['__EMPTY_25']) !== null && _k !== void 0 ? _k : '';
                                risks.push(risk2);
                                if (xlsxFileAsJsonObject[x + 6]['__EMPTY_8']) {
                                    let risk3 = {
                                        risk: '',
                                        description: '',
                                        criticality: '',
                                        migration: '',
                                        resolutionDate: '',
                                    };
                                    risk3.risk = (_l = xlsxFileAsJsonObject[x + 6]['__EMPTY_8']) !== null && _l !== void 0 ? _l : '';
                                    risk3.risk = (_m = xlsxFileAsJsonObject[x + 6]['__EMPTY_10']) !== null && _m !== void 0 ? _m : '';
                                    risk3.risk = (_o = xlsxFileAsJsonObject[x + 6]['__EMPTY_17']) !== null && _o !== void 0 ? _o : '';
                                    risk3.risk = (_p = xlsxFileAsJsonObject[x + 6]['__EMPTY_19']) !== null && _p !== void 0 ? _p : '';
                                    risk3.risk = (_q = xlsxFileAsJsonObject[x + 6]['__EMPTY_25']) !== null && _q !== void 0 ? _q : '';
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
                        await this.sheetModel.updateOne({ _id: newlySavedExcelSheet._id }, { $push: { measures: savedMeasure } });
                        return savedMeasure;
                    })
                        .then(async (savedMeasure) => {
                        const artefacts = this.getArtefactsFromLinesArray(xlsxFileAsJsonObject);
                        const savedArtefact_IDs = [];
                        artefacts.map((art) => {
                            const toSave = {
                                id: art['__EMPTY_1'],
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
                                await this.measureModel.updateOne({ _id: savedMeasure._id }, { $push: { artefacts: savedArtefact } });
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
    getArtefactsFromLinesArray(sheet) {
        return sheet.filter((line) => {
            const firstKey = Object.keys(line)[0];
            if (firstKey === '__EMPTY_1') {
                const firstItem = `${line[firstKey]}`;
                try {
                    if (parseInt(firstItem) < 10 && Object.keys(line).length > 2) {
                        return line;
                    }
                }
                catch (e) {
                    console.log(e);
                }
            }
        });
    }
    parse_overview() {
        const workbook = XLSX.readFile(path_1.resolve(globalVars_1.fileNames.xlsx_file_dir, globalVars_1.fileNames.main_file));
        const overview_object = workbook.Sheets['Status Overview'];
        const risks = [];
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
                    await this.measureModel.updateOne({ title: addToResult.name }, {
                        risk: addToResult.risk,
                        budget: addToResult.budget,
                        artefact: addToResult.artefact,
                    });
                }
            }
        });
    }
    async parseKPI() {
        const workbook = XLSX.readFile(path_1.resolve(globalVars_1.fileNames.xlsx_file_dir, globalVars_1.fileNames.kpi_file_1));
        const overview_object = workbook.Sheets['Plan view'];
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
        const measures = await this.measureModel.find();
        measures.map(async (measure) => {
            let rowOfThisMeasure;
            for (let i = 0; i < rowsOfMeasures.length; i++) {
                if (rowsOfMeasures[i].measureName === measure.title) {
                    rowOfThisMeasure = rowsOfMeasures[i].row;
                }
            }
            let actuals;
            let target;
            let lastPlan;
            Object.keys(overview_object).filter((key) => {
                if (key.includes('G')) {
                    const row = parseInt(key.substring(1));
                    if (row == rowOfThisMeasure) {
                        console.log("----------------");
                        console.log(overview_object[key]);
                        console.log();
                        console.log("----------------");
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
                    const row = parseInt(key.substring(1));
                    if (row == rowOfThisMeasure) {
                        lastPlan = overview_object[key]['v'];
                    }
                }
            });
            console.log(measure.title + '  ' + actuals + '  ' + target + '  ' + lastPlan);
            let kpiProgressOfThisMeasure;
            if (actuals < lastPlan) {
                kpiProgressOfThisMeasure = 1;
            }
            else if (lastPlan <= actuals && actuals < target) {
                kpiProgressOfThisMeasure = 1;
            }
            else if (actuals >= target) {
                kpiProgressOfThisMeasure = 2;
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
    async parseBudgetMonths() {
        const workbook = XLSX.readFile(path_1.resolve(globalVars_1.fileNames.xlsx_file_dir, globalVars_1.fileNames.budget_file));
        const overview_object = workbook.Sheets['1. Overview'];
        const detailes_object = workbook.Sheets['2. Detailed view'];
        const totalApprovedBudget = overview_object['M36']['v'];
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
        const sumRow = 281;
        const monthlySpendings = month_columns.map((month, index) => {
            return Math.round(detailes_object[month + '' + sumRow]['v'] * 100) / 100;
        });
        const approvedBudgetPerMonth = Math.round((totalApprovedBudget / month_columns.length) * 100) / 100;
        const year = new Date().getFullYear();
        const newBudget = new this.budgetModel({
            monthlySpendings,
            approvedBudgetPerMonth,
            year,
        });
        newBudget.save().then((result) => {
            console.log('budget saved');
        });
        const excelSheet = await this.sheetModel.findOne({
            name: globalVars_1.fileNames.main_file,
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
        }
        else if (temp.includes('.')) {
            const index = temp.indexOf('.');
            result = temp.substring(0, index) + temp.substring(index + 1);
        }
        else if (temp.includes('-')) {
            result = '0';
        }
        return parseInt(result);
    }
    async parseBudgetPast() {
        const workbookBudgetPastFile = XLSX.readFile(path_1.resolve(globalVars_1.fileNames.xlsx_file_dir, globalVars_1.fileNames.budget_past));
        const budgetPastAsJsonObject = workbookBudgetPastFile.Sheets["Measure Overview"];
        const result = [];
        let rowPosition = 6;
        let currentYear = 0;
        while (budgetPastAsJsonObject["B" + rowPosition]) {
            if ((budgetPastAsJsonObject["B" + rowPosition].v + "").substring(0, 1) === "M") {
                const pastBudget = {
                    name: budgetPastAsJsonObject["B" + rowPosition].v,
                    budget: budgetPastAsJsonObject["E" + rowPosition].v,
                    category: budgetPastAsJsonObject["F" + rowPosition].v,
                    year: currentYear
                };
                result.push(pastBudget);
                const pastBudgetToDB = new this.pastBudgetModel(pastBudget);
                await pastBudgetToDB.save();
            }
            else if ((budgetPastAsJsonObject["B" + rowPosition].v + "").substring(0, 1) === "2") {
                currentYear = budgetPastAsJsonObject["B" + rowPosition].v;
            }
            rowPosition++;
        }
        return result;
    }
};
XlsxParserService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel('Artefact')),
    __param(1, mongoose_1.InjectModel('Measure')),
    __param(2, mongoose_1.InjectModel('Sheet')),
    __param(3, mongoose_1.InjectModel('Budget')),
    __param(4, mongoose_1.InjectModel('PastBudget')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], XlsxParserService);
exports.XlsxParserService = XlsxParserService;
//# sourceMappingURL=xlsx-parser.service.js.map