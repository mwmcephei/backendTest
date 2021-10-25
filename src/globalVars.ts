const distPath = __dirname; // ...pmo/pmo-backend/dist
const rootPath_array = distPath.split('/');
rootPath_array.pop();
export const rootPath = rootPath_array.join('/');
const rootPathSrc = rootPath_array.join('/') + '/src/';
const xlsx_file_dir = rootPath + '/src/';


export const fileNames = {
  xlsx_file_dir,
  main_file: 'realData/test_data.xlsx',    // = Status Report Demo.xlsx
  kpi_file_1: 'realData/KPI-report_1.xlsx',
  kpi_file_2: 'KPI-report_2.xlsx',
  budget_file: 'realData/budget_report.xlsx',
  status_report: 'realData/status_report.xlsx', // = overview
  budget_past: 'realData/budget_past.xlsx',
};

type FocusAreaNames = {
  "Slow down hackers": "SH",
  "Increase detection": "ID",
  "Reduce damage": "RD",
  "Streamline compliance": "SC",
  "Build Security org/skills": "BS"
}

export const FOCUS_AREA_NAMES: FocusAreaNames = {
  "Slow down hackers": "SH",
  "Increase detection": "ID",
  "Reduce damage": "RD",
  "Streamline compliance": "SC",
  "Build Security org/skills": "BS"
}