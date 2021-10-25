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
const upload_schema_1 = require("../schemas/upload.schema");
const fs = require('fs');
let XlsxParserService = class XlsxParserService {
    constructor(artefactModel, artefactTEMPModel, measureModel, measureTEMPModel, sheetModel, sheetTEMPModel, budgetModel, budgetTEMPModel, pastBudgetModel, notificationModel, notificationStatusModel, uploadModel) {
        this.artefactModel = artefactModel;
        this.artefactTEMPModel = artefactTEMPModel;
        this.measureModel = measureModel;
        this.measureTEMPModel = measureTEMPModel;
        this.sheetModel = sheetModel;
        this.sheetTEMPModel = sheetTEMPModel;
        this.budgetModel = budgetModel;
        this.budgetTEMPModel = budgetTEMPModel;
        this.pastBudgetModel = pastBudgetModel;
        this.notificationModel = notificationModel;
        this.notificationStatusModel = notificationStatusModel;
        this.uploadModel = uploadModel;
    }
    async triggerParsing() {
        await this.uploadModel.deleteMany({});
        let statusReportExists = false;
        let budgetReportExists = false;
        let kpiReportExists = false;
        let datatExists = false;
        let pastBudgetsExists = false;
        try {
            if (fs.existsSync(globalVars_1.rootPath + "/data/" + "status_report.xlsx")) {
                statusReportExists = true;
            }
            else {
                await fs.copyFile(globalVars_1.rootPath + "/src/realData/" + "status_report.xlsx", globalVars_1.rootPath + "/data/" + "status_report.xlsx", (err) => {
                    if (err) {
                        throw err;
                    }
                    else {
                        console.log('source.txt was copied to destination.txt');
                        statusReportExists = true;
                    }
                });
            }
            if (fs.existsSync(globalVars_1.rootPath + "/data/" + "budget_report.xlsx")) {
                budgetReportExists = true;
            }
            else {
                await fs.copyFile(globalVars_1.rootPath + "/src/realData/" + "budget_report.xlsx", globalVars_1.rootPath + "/data/" + "budget_report.xlsx", (err) => {
                    if (err) {
                        throw err;
                    }
                    else {
                        console.log('source.txt was copied to destination.txt');
                        budgetReportExists = true;
                    }
                });
            }
            if (fs.existsSync(globalVars_1.rootPath + "/data/" + "KPI-report_1.xlsx")) {
                kpiReportExists = true;
            }
            else {
                await fs.copyFile(globalVars_1.rootPath + "/src/realData/" + "KPI-report_1.xlsx", globalVars_1.rootPath + "/data/" + "KPI-report_1.xlsx", (err) => {
                    if (err) {
                        throw err;
                    }
                    else {
                        console.log('source.txt was copied to destination.txt');
                        kpiReportExists = true;
                    }
                });
            }
            if (fs.existsSync(globalVars_1.rootPath + "/data/" + "test_data.xlsx")) {
                datatExists = true;
            }
            else {
                await fs.copyFile(globalVars_1.rootPath + "/src/realData/" + "test_data.xlsx", globalVars_1.rootPath + "/data/" + "test_data.xlsx", (err) => {
                    if (err) {
                        throw err;
                    }
                    else {
                        console.log('source.txt was copied to destination.txt');
                        datatExists = true;
                    }
                });
            }
            if (fs.existsSync(globalVars_1.rootPath + "/data/" + "budget_past.xlsx")) {
                pastBudgetsExists = true;
            }
            else {
                await fs.copyFile(globalVars_1.rootPath + "/src/realData/" + "budget_past.xlsx", globalVars_1.rootPath + "/data/" + "budget_past.xlsx", (err) => {
                    if (err) {
                        throw err;
                    }
                    else {
                        console.log('source.txt was copied to destination.txt');
                        pastBudgetsExists = true;
                    }
                });
            }
        }
        catch (err) {
            console.error(err);
        }
        const parsedNewData = await this.parseAll(true);
        if (parsedNewData) {
            const measuresOLD = await this.measureModel.find();
            const measuresNew = await this.measureTEMPModel.find();
            if (measuresOLD.length > 0) {
                await this.checkForChanges(measuresOLD, measuresNew);
                await this.moveFilesAfterParsing();
                const deletedNew = await this.deleteData(true);
                const deletedOld = await this.deleteData(false);
                if (deletedNew && deletedOld) {
                    const parsedNewDataAsOld = await this.parseAll(false);
                    if (parsedNewDataAsOld) {
                        console.log("done");
                    }
                }
            }
            else {
                await this.moveFilesAfterParsing();
                const deletedNew = await this.deleteData(true);
                if (deletedNew) {
                    const parsedNewDataAsOld = await this.parseAll(true);
                    if (parsedNewDataAsOld) {
                        console.log("done");
                    }
                }
            }
            return JSON.stringify("ok");
        }
    }
    async parseAll(temp) {
        const parseResult = await this.parse(temp);
        if (parseResult) {
            console.log("##################" + parseResult);
            const parseOverviewResult = await this.parse_overview(temp);
            if (parseOverviewResult) {
                console.log("##################" + parseOverviewResult);
                const createOverviewResult = await this.createOverview(temp);
                if (createOverviewResult) {
                    console.log("##################" + createOverviewResult);
                    const kpiResult = await this.parseKPI(temp);
                    if (kpiResult) {
                        console.log("##################" + kpiResult);
                        await this.parseBudgetMonths(temp);
                    }
                }
            }
        }
        return true;
    }
    async deleteData(temp) {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                if (false)
                    reject(new Error('no first name passed in!'));
                if (temp) {
                    await this.measureTEMPModel.deleteMany({});
                    await this.artefactTEMPModel.deleteMany({});
                    await this.budgetTEMPModel.deleteMany({});
                    await this.sheetTEMPModel.deleteMany({});
                    resolve(true);
                }
                else {
                    await this.measureModel.deleteMany({});
                    await this.artefactModel.deleteMany({});
                    await this.budgetModel.deleteMany({});
                    await this.sheetModel.deleteMany({});
                    resolve(true);
                }
            }, 2000);
        });
    }
    checkForChanges(measuresOLD, measuresNew) {
        const oldMeasureNames = new Set(measuresOLD.map(m => m.title));
        const newMeasureNames = new Set(measuresNew.map(m => m.title));
        if (this.eqSet(oldMeasureNames, newMeasureNames)) {
            const mapMeasuresOLD = measuresOLD.reduce(function (map, obj) {
                map[obj.title] = obj;
                return map;
            }, {});
            const mapMeasuresNEW = measuresNew.reduce(function (map, obj) {
                map[obj.title] = obj;
                return map;
            }, {});
            const overallStatuses = {
                0: "Green",
                1: "Yellow",
                2: "Red"
            };
            const kpiStates = {
                0: "Behind",
                1: "On Track",
                2: "Achieved"
            };
            Array.from(oldMeasureNames).forEach(async (mOldName) => {
                const oldMeasure = mapMeasuresOLD[mOldName + ""];
                const newMeasure = mapMeasuresNEW[mOldName + ""];
                if (oldMeasure.kpiProgress === 1 && newMeasure.kpiProgress === 0) {
                    const newNot = new this.notificationModel({
                        title: mOldName + ": KPI Progress changed",
                        body: "From " + kpiStates[oldMeasure.kpiProgress] + " to " + kpiStates[newMeasure.kpiProgress],
                        time: this.datetimNow(),
                        type: "progress",
                        measure: newMeasure.title,
                        seen: false,
                        notified: false
                    });
                    await newNot.save();
                }
                const oldStatus = Math.max(oldMeasure.budget, oldMeasure.artefact, oldMeasure.risk);
                const newStatus = Math.max(newMeasure.budget, newMeasure.artefact, newMeasure.risk);
                if ((oldStatus === 0 && newStatus === 1) || (oldStatus === 1 && newStatus === 2)) {
                    const notification = {
                        title: mOldName + ": Measure Status changed",
                        body: "From " + overallStatuses[oldStatus] + " to " + overallStatuses[newStatus],
                        time: this.datetimNow(),
                        type: "status",
                        measure: newMeasure.title,
                        seen: false,
                        notified: false
                    };
                    console.log(notification);
                    const newNot = new this.notificationModel(notification);
                    await newNot.save();
                }
                if (oldMeasure.help === "No" && newMeasure.help === "Yes") {
                    const notification = {
                        title: mOldName + ": Help required!",
                        body: "",
                        time: this.datetimNow(),
                        type: "help",
                        measure: newMeasure.title,
                        seen: false,
                        notified: false
                    };
                    console.log(notification);
                    const newNot = new this.notificationModel(notification);
                    await newNot.save();
                }
            });
        }
        else {
            console.log("not same measures");
        }
    }
    datetimNow() {
        const currentdate = new Date();
        return currentdate.getDate() + "."
            + (currentdate.getMonth() + 1) + "."
            + currentdate.getFullYear() + " "
            + currentdate.getHours() + ":"
            + currentdate.getMinutes();
    }
    eqSet(as, bs) {
        if (as.size !== bs.size)
            return false;
        for (var a of as)
            if (!bs.has(a))
                return false;
        return true;
    }
    async moveFilesAfterParsing() {
        fs.readdir(globalVars_1.rootPath + '/data/', (err, files) => {
            files.forEach(file => {
                fs.rename(globalVars_1.rootPath + '/data/' + file, globalVars_1.rootPath + '/src/realData/' + file, function (err) {
                    if (err) {
                        throw err;
                    }
                    else {
                        console.log("Successfully moved the file!");
                    }
                });
            });
        });
    }
    async createOverview(temp) {
        const main_file = temp ? globalVars_1.rootPath + "/data/" + "test_data.xlsx" : path_1.resolve(globalVars_1.fileNames.xlsx_file_dir, globalVars_1.fileNames.main_file);
        const status_report = temp ? globalVars_1.rootPath + "/data/" + "status_report.xlsx" : path_1.resolve(globalVars_1.fileNames.xlsx_file_dir, globalVars_1.fileNames.status_report);
        const budget_file = temp ? globalVars_1.rootPath + "/data/" + "budget_report.xlsx" : path_1.resolve(globalVars_1.fileNames.xlsx_file_dir, globalVars_1.fileNames.budget_file);
        const kpi_file_1 = temp ? globalVars_1.rootPath + "/data/" + "KPI-report_1.xlsx" : path_1.resolve(globalVars_1.fileNames.xlsx_file_dir, globalVars_1.fileNames.kpi_file_1);
        const workbookKPIFile = XLSX.readFile(kpi_file_1);
        const workbookBudgetFile = XLSX.readFile(budget_file);
        const workbookStatusReport = XLSX.readFile(status_report);
        const KPIAsJsonObject = workbookKPIFile.Sheets['Plan view'];
        const statusReportAsJsonObject = XLSX.utils.sheet_to_json(workbookStatusReport.Sheets[workbookStatusReport.SheetNames[0]]);
        const budgetReoportAsJsonObject = XLSX.utils.sheet_to_json(workbookBudgetFile.Sheets[workbookBudgetFile.SheetNames[0]]);
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
        const budgetDate = budgetReoportAsJsonObject[1]["__EMPTY_25"].split("(")[1].split(")")[0];
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
        const excelSheet = temp ? await this.sheetTEMPModel.findOne()
            : await this.sheetModel.findOne();
        console.log("SO FAR...4.5");
        console.log(excelSheet);
        console.log(typeof (excelSheet));
        if (excelSheet) {
            const numberOfMeasures = excelSheet.measures.length;
            console.log(numberOfMeasures);
            const workbook = XLSX.readFile(main_file);
            console.log(workbook.SheetNames);
            const overview_object = workbook.Sheets['Status Overview'];
            console.log("SO FAR...5");
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
            console.log("SO FAR...6");
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
            console.log("SO FAR...7");
            let sumAvgProgressTimesBudgetOfMEasures = 0;
            for (let m = 0; m < excelSheet.measures.length; m++) {
                const measure = temp
                    ?
                        await (await this.measureTEMPModel.findById(excelSheet.measures[m]))
                            .populate('artefacts')
                            .execPopulate()
                    :
                        await (await this.measureModel.findById(excelSheet.measures[m]))
                            .populate('artefacts')
                            .execPopulate();
                console.log("SO FAR...8");
                let avgProgressOfArtefacts = 0;
                measure.artefacts.map((art) => {
                    avgProgressOfArtefacts += art.progress;
                });
                avgProgressOfArtefacts =
                    avgProgressOfArtefacts / measure.artefacts.length;
                let tempx = 0;
                allBudgetsOfMeasures.map((item) => {
                    if (item[measure.title]) {
                        if (isNaN(avgProgressOfArtefacts)) {
                            tempx = item[measure.title];
                        }
                        else {
                            tempx = item[measure.title] * avgProgressOfArtefacts;
                        }
                    }
                });
                sumAvgProgressTimesBudgetOfMEasures += tempx;
            }
            console.log("SO FAR...9");
            const progressOverviewBarResult = sumAvgProgressTimesBudgetOfMEasures / totalBudget;
            const KPIprogressOfAllMeasures = this.getKPIProgressData(kpi_file_1);
            let sum = 0;
            KPIprogressOfAllMeasures.map((item) => {
                allBudgetsOfMeasures.map((budgetOfMeasure) => {
                    if (budgetOfMeasure[Object.keys(budgetOfMeasure)[0]]) {
                        const tempx = item.progress * budgetOfMeasure[Object.keys(budgetOfMeasure)[0]];
                        sum += tempx;
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
        const workbook = XLSX.readFile(kpiFile);
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
    async parse(temp) {
        let result = "parse failed";
        const focusAreaNames = {
            'Slow Down Hackers': 'SH',
            'Increase Detection': 'ID',
            'Reduce Damage': 'RD',
            'Streamline Compliance': 'SC',
            'Build Security Organization / Skills': 'BS',
        };
        const main_file = temp ? globalVars_1.rootPath + "/data/" + "test_data.xlsx" : path_1.resolve(globalVars_1.fileNames.xlsx_file_dir, globalVars_1.fileNames.main_file);
        const status_report = temp ? globalVars_1.rootPath + "/data/" + "status_report.xlsx" : path_1.resolve(globalVars_1.fileNames.xlsx_file_dir, globalVars_1.fileNames.status_report);
        const budget_file = temp ? globalVars_1.rootPath + "/data/" + "budget_report.xlsx" : path_1.resolve(globalVars_1.fileNames.xlsx_file_dir, globalVars_1.fileNames.budget_file);
        const kpi_file_1 = temp ? globalVars_1.rootPath + "/data/" + "KPI-report_1.xlsx" : path_1.resolve(globalVars_1.fileNames.xlsx_file_dir, globalVars_1.fileNames.kpi_file_1);
        const newSheet = {};
        const excelFile = temp ? new this.sheetTEMPModel(newSheet) : new this.sheetModel(newSheet);
        const newlySavedExcelSheet = await excelFile.save();
        if (newlySavedExcelSheet) {
            const workbook = XLSX.readFile(main_file, { cellDates: true });
            const workbookStatusReportFile = XLSX.readFile(status_report);
            const workbookBudgetFile = XLSX.readFile(budget_file);
            const kpiWorkbook = XLSX.readFile(kpi_file_1);
            const statusReportAsJsonObject = XLSX.utils.sheet_to_json(workbookStatusReportFile.Sheets[workbookStatusReportFile.SheetNames[0]]);
            const budgetFileAsJsonObject = XLSX.utils.sheet_to_json(workbookBudgetFile.Sheets['1. Overview']);
            const budgetDetailsFileAsJsonObject = workbookBudgetFile.Sheets['2. Detailed view'];
            const kpiFileAsJsonObject = kpiWorkbook.Sheets['Plan view'];
            const sheet_name_list = workbook.SheetNames;
            for (let i = 0; i < sheet_name_list.length; i++) {
                const sheetName = sheet_name_list[i];
                if (sheetName !== 'Status Overview' && sheetName !== 'Overview') {
                    const month_columns = [];
                    Object.keys(budgetDetailsFileAsJsonObject).forEach((key) => {
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
                        Object.keys(budgetDetailsFileAsJsonObject).forEach((key) => {
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
                    Object.keys(kpiFileAsJsonObject).forEach((key) => {
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
                    const help = xlsxFileAsJsonObject[1]["__EMPTY_28"];
                    const risks = [];
                    for (let x = 0; x < xlsxFileAsJsonObject.length; x++) {
                        if (xlsxFileAsJsonObject[x]['__EMPTY_2'] ===
                            'KPI Description (Actuals/Target)') {
                            const risk1 = this.getRisk(x, xlsxFileAsJsonObject);
                            risks.push(risk1);
                            if (typeof (xlsxFileAsJsonObject[x + 3]['__EMPTY_8']) !== 'undefined') {
                                const risk2 = this.getRisk(x + 3, xlsxFileAsJsonObject);
                                risks.push(risk2);
                                if (typeof (xlsxFileAsJsonObject[x + 6]['__EMPTY_8']) !== 'undefined') {
                                    const risk3 = this.getRisk(x + 6, xlsxFileAsJsonObject);
                                    risks.push(risk3);
                                    if (xlsxFileAsJsonObject[x + 7] && typeof (xlsxFileAsJsonObject[x + 7]) !== 'undefined') {
                                        if (!("" + xlsxFileAsJsonObject[x + 7]['__EMPTY_8']).includes("Medium")) {
                                            const risk4 = this.getRisk(x + 7, xlsxFileAsJsonObject);
                                            risks.push(risk4);
                                            if (xlsxFileAsJsonObject[x + 8] && typeof (xlsxFileAsJsonObject[x + 8]) !== 'undefined') {
                                                const risk5 = this.getRisk(x + 8, xlsxFileAsJsonObject);
                                                risks.push(risk5);
                                            }
                                        }
                                    }
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
                        help
                    };
                    const measure = temp ? new this.measureTEMPModel(newMeasure) : new this.measureModel(newMeasure);
                    const savedMeasure = await measure.save();
                    if (savedMeasure) {
                        const updatedMeasure = temp ?
                            await this.sheetTEMPModel.updateOne({ _id: newlySavedExcelSheet._id }, { $push: { measures: savedMeasure } })
                            :
                                await this.sheetModel.updateOne({ _id: newlySavedExcelSheet._id }, { $push: { measures: savedMeasure } });
                        if (updatedMeasure) {
                            result = "updated measure " + sheetName;
                            const artefacts = this.getArtefactsFromLinesArray(xlsxFileAsJsonObject);
                            const savedArtefact_IDs = [];
                            artefacts.forEach(async (art) => {
                                const toSave = {
                                    id: art['__EMPTY_1'],
                                    description: art['__EMPTY_2'],
                                    progress: art['__EMPTY_9'],
                                    budget: art['__EMPTY_11'] ? art['__EMPTY_11'] : '',
                                    achievement: art['__EMPTY_13'],
                                    work: art['__EMPTY_21'],
                                };
                                const artefact = temp ? new this.artefactTEMPModel(toSave) : new this.artefactModel(toSave);
                                const savedArtefact = await artefact.save();
                                if (savedArtefact) {
                                    savedArtefact_IDs.push(savedArtefact._id);
                                    temp ?
                                        await this.measureTEMPModel.updateOne({ _id: savedMeasure._id }, { $push: { artefacts: savedArtefact } })
                                        :
                                            await this.measureModel.updateOne({ _id: savedMeasure._id }, { $push: { artefacts: savedArtefact } });
                                }
                            });
                        }
                    }
                }
                if (i === sheet_name_list.length - 1) {
                    return "went through all measures";
                }
            }
        }
        else {
            return result;
        }
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
    parse_overview(temp) {
        const main_file = temp ? globalVars_1.rootPath + "/data/" + "test_data.xlsx" : path_1.resolve(globalVars_1.fileNames.xlsx_file_dir, globalVars_1.fileNames.main_file);
        const workbook = XLSX.readFile(main_file);
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
                    temp ?
                        await this.measureTEMPModel.updateOne({ title: addToResult.name }, {
                            risk: addToResult.risk,
                            budget: addToResult.budget,
                            artefact: addToResult.artefact,
                        })
                        :
                            await this.measureModel.updateOne({ title: addToResult.name }, {
                                risk: addToResult.risk,
                                budget: addToResult.budget,
                                artefact: addToResult.artefact,
                            });
                }
            }
        });
        return result;
    }
    async parseKPI(temp) {
        const kpi_file_1 = temp ? globalVars_1.rootPath + "/data/" + "KPI-report_1.xlsx" : path_1.resolve(globalVars_1.fileNames.xlsx_file_dir, globalVars_1.fileNames.kpi_file_1);
        const workbook = XLSX.readFile(kpi_file_1);
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
        const measures = temp ? await this.measureTEMPModel.find() : await this.measureModel.find();
        measures.map(async (measure) => {
            let rowOfThisMeasure;
            for (let i = 0; i < rowsOfMeasures.length; i++) {
                if (rowsOfMeasures[i].measureName === measure.title) {
                    rowOfThisMeasure = rowsOfMeasures[i].row;
                }
            }
            let actuals;
            let target;
            let plan1;
            let plan2;
            let plan3;
            let plan4;
            Object.keys(overview_object).filter((key) => {
                if (key.includes('G')) {
                    const row = parseInt(key.substring(1));
                    if (row == rowOfThisMeasure) {
                        actuals = overview_object[key]['v'];
                    }
                }
                if (key.includes('H')) {
                    const row = parseInt(key.substring(1));
                    if (row == rowOfThisMeasure) {
                        target = overview_object[key]['v'];
                    }
                }
                if (key.includes('J')) {
                    const row = parseInt(key.substring(1));
                    if (row == rowOfThisMeasure) {
                        plan1 = overview_object[key]['v'];
                    }
                }
                if (key.includes('K')) {
                    const row = parseInt(key.substring(1));
                    if (row == rowOfThisMeasure) {
                        plan2 = overview_object[key]['v'];
                    }
                }
                if (key.includes('L')) {
                    const row = parseInt(key.substring(1));
                    if (row == rowOfThisMeasure) {
                        plan3 = overview_object[key]['v'];
                    }
                }
                if (key.includes('M')) {
                    const row = parseInt(key.substring(1));
                    if (row == rowOfThisMeasure) {
                        plan4 = overview_object[key]['v'];
                    }
                }
            });
            const excelSheet = await this.sheetModel.findOne();
            const actualMonth = excelSheet.kpiDates[1].split(".")[1];
            const monthsOfPlans = excelSheet.kpiPlans.map(plan => {
                return plan.split("/")[0];
            });
            let kpiProgressOfThisMeasure;
            let relevantPlan = monthsOfPlans[0];
            let relevantPlanMonth = 0;
            for (let i = 0; i < monthsOfPlans.length; i++) {
                if (monthsOfPlans[i] === actualMonth) {
                    relevantPlan = monthsOfPlans[i];
                    relevantPlanMonth = i;
                }
            }
            const plans = [plan1, plan2, plan3, plan4];
            if (relevantPlanMonth === 0) {
                kpiProgressOfThisMeasure = 1;
            }
            else {
                if (actuals < plans[relevantPlanMonth - 1]) {
                    kpiProgressOfThisMeasure = 0;
                }
                else if (actuals >= target) {
                    kpiProgressOfThisMeasure = 2;
                }
            }
            const updatedMeasure = await measure.update({
                kpiProgress: kpiProgressOfThisMeasure,
            });
        });
        return 'ok';
    }
    async parseBudgetMonths(temp) {
        let result = "parseBudgetMonths failed";
        const main_file = temp ? globalVars_1.rootPath + "/data/" + "test_data.xlsx" : path_1.resolve(globalVars_1.fileNames.xlsx_file_dir, globalVars_1.fileNames.main_file);
        const status_report = temp ? globalVars_1.rootPath + "/data/" + "status_report.xlsx" : path_1.resolve(globalVars_1.fileNames.xlsx_file_dir, globalVars_1.fileNames.status_report);
        const budget_file = temp ? globalVars_1.rootPath + "/data/" + "budget_report.xlsx" : path_1.resolve(globalVars_1.fileNames.xlsx_file_dir, globalVars_1.fileNames.budget_file);
        const kpi_file_1 = temp ? globalVars_1.rootPath + "/data/" + "KPI-report_1.xlsx" : path_1.resolve(globalVars_1.fileNames.xlsx_file_dir, globalVars_1.fileNames.kpi_file_1);
        const workbook = XLSX.readFile(budget_file);
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
        const newBudget = temp
            ?
                new this.budgetTEMPModel({
                    monthlySpendings,
                    approvedBudgetPerMonth,
                    year,
                })
            :
                new this.budgetModel({
                    monthlySpendings,
                    approvedBudgetPerMonth,
                    year,
                });
        newBudget.save().then((result) => {
            console.log('budget saved');
        });
        const excelSheet = temp ? await this.sheetTEMPModel.findOne() : await this.sheetModel.findOne();
        if (excelSheet) {
            const updatedExclSheet = excelSheet.update({ totalBudget: totalApprovedBudget });
            if (updatedExclSheet) {
                console.log(updatedExclSheet);
                result = 'budget parsed';
            }
        }
        return result;
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
                    title: budgetPastAsJsonObject["B" + rowPosition].v,
                    name: budgetPastAsJsonObject["C" + rowPosition].v,
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
    formatRiskDate(input) {
        if (input) {
            if (input.substring(0, 4) === "asap") {
                return input.replace(/(\r\n|\n|\r)/gm, "");
            }
            else {
                const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                const splitInput = input.split(" ");
                const day = splitInput[2];
                const monthRaw = splitInput[1];
                let month = months.includes(monthRaw) ? months.indexOf(monthRaw) + "" : "";
                month = month.length < 2 ? "0" + month : month;
                const year = splitInput[3];
                return day + "." + month + "." + year;
            }
        }
        else {
            return "";
        }
    }
    getRisk(line, xlsxFileAsJsonObject) {
        var _a, _b, _c, _d;
        let risk = {
            risk: '',
            description: '',
            criticality: '',
            migration: '',
            resolutionDate: '',
        };
        risk.risk = (_a = xlsxFileAsJsonObject[line]['__EMPTY_8']) !== null && _a !== void 0 ? _a : '';
        risk.description = (_b = xlsxFileAsJsonObject[line]['__EMPTY_10']) !== null && _b !== void 0 ? _b : '';
        risk.criticality = (_c = xlsxFileAsJsonObject[line]['__EMPTY_17']) !== null && _c !== void 0 ? _c : '';
        risk.migration = (_d = xlsxFileAsJsonObject[line]['__EMPTY_19']) !== null && _d !== void 0 ? _d : '';
        risk.resolutionDate = xlsxFileAsJsonObject[line]['__EMPTY_25']
            ? this.formatRiskDate(xlsxFileAsJsonObject[line]['__EMPTY_25'].toString())
            : "";
        return risk;
    }
};
XlsxParserService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel('Artefact')),
    __param(1, mongoose_1.InjectModel('ArtefactTEMP')),
    __param(2, mongoose_1.InjectModel('Measure')),
    __param(3, mongoose_1.InjectModel('MeasureTEMP')),
    __param(4, mongoose_1.InjectModel('Sheet')),
    __param(5, mongoose_1.InjectModel('SheetTEMP')),
    __param(6, mongoose_1.InjectModel('Budget')),
    __param(7, mongoose_1.InjectModel('BudgetTEMP')),
    __param(8, mongoose_1.InjectModel('PastBudget')),
    __param(9, mongoose_1.InjectModel('Notification')),
    __param(10, mongoose_1.InjectModel('NotificationStatus')),
    __param(11, mongoose_1.InjectModel('Upload')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], XlsxParserService);
exports.XlsxParserService = XlsxParserService;
//# sourceMappingURL=xlsx-parser.service.js.map