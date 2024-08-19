/* eslint-disable @typescript-eslint/no-explicit-any */
import * as XLSX from 'xlsx';

type ReturnType = {
	[key: string]: any;
};
export function parseJsonToExcel(data: string | ArrayBuffer) {
	// Parse the Excel file
	const workbook = XLSX.read(data, { type: 'buffer' });
	const sheetName = workbook.SheetNames[0]; // Assuming there's only one sheet
	const sheet = workbook.Sheets[sheetName];

	// Convert the sheet to an array of objects
	const jsonData = XLSX.utils.sheet_to_json(sheet);
	return jsonData as ReturnType[];
}
