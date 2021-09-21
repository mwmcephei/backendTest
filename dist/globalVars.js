"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FOCUS_AREA_NAMES = exports.fileNames = void 0;
const distPath = __dirname;
const rootPath_array = distPath.split('/');
rootPath_array.pop();
const rootPath = rootPath_array.join('/') + '/src/';
const xlsx_file_dir = rootPath + 'xlsx_files/';
exports.fileNames = {
    xlsx_file_dir,
    main_file: 'testData/test_data.xlsx',
    kpi_file_1: 'testData/KPI-report_1.xlsx',
    kpi_file_2: 'KPI-report_2.xlsx',
    budget_file: 'testData/budget_report.xlsx',
    status_report: 'testData/status_report.xlsx',
};
exports.FOCUS_AREA_NAMES = {
    "Slow down hackers": "SH",
    "Increase detection": "ID",
    "Reduce damage": "RD",
    "Streamline compliance": "SC",
    "Build Security org/skills": "BS"
};
//# sourceMappingURL=globalVars.js.map