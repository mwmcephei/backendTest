"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FOCUS_AREA_NAMES = exports.fileNames = exports.rootPath = void 0;
const distPath = __dirname;
const rootPath_array = distPath.split('/');
rootPath_array.pop();
exports.rootPath = rootPath_array.join('/');
const rootPathSrc = rootPath_array.join('/') + '/src/';
const xlsx_file_dir = exports.rootPath + '/src/';
exports.fileNames = {
    xlsx_file_dir,
    main_file: 'realData/test_data.xlsx',
    kpi_file_1: 'realData/KPI-report_1.xlsx',
    kpi_file_2: 'KPI-report_2.xlsx',
    budget_file: 'realData/budget_report.xlsx',
    status_report: 'realData/status_report.xlsx',
    budget_past: 'realData/budget_past.xlsx',
};
exports.FOCUS_AREA_NAMES = {
    "Slow down hackers": "SH",
    "Increase detection": "ID",
    "Reduce damage": "RD",
    "Streamline compliance": "SC",
    "Build Security org/skills": "BS"
};
//# sourceMappingURL=globalVars.js.map