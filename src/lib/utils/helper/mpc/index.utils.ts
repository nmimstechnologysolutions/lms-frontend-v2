import { facultyRoleStore } from '$lib/stores/mpc/faculty-role';
import type { FormBData, GroupedFormBData, UserRoleResult } from '$lib/types/mpc';
import { MPC_USER_ROLE } from '$lib/utils/constants/mpc.constants';
import pkg from 'exceljs';
const {Workbook} = pkg;
import type { BookType } from 'xlsx';
import * as XLSX from 'xlsx';

export function addRoleInStoreForChecked(item: UserRoleResult, role: string, isChecked: boolean) {
	facultyRoleStore.update((store) => {
		const index = store.findIndex((s) => s.usersessionLid === item.user_session_lid);

		if(index === -1) {
			store = [...store, {
				usersessionLid: item.user_session_lid,
				username: item.username,
				program_lid: item.program_id,
				facultyName: `${item.first_name} ${item.last_name}`,
				isProgramAnchor: role === MPC_USER_ROLE.PROGRAM_ANCHOR ? isChecked : null,
				isCourseAnchor: role === MPC_USER_ROLE.COURSE_ANCHOR ? isChecked : null
			}]
		} else {
			store[index] = {
				...store[index],
				isProgramAnchor: role === MPC_USER_ROLE.PROGRAM_ANCHOR ? isChecked : store[index].isProgramAnchor,
				isCourseAnchor: role === MPC_USER_ROLE.COURSE_ANCHOR ? isChecked : store[index].isCourseAnchor
			}
		}

		return store
	})
}

export function groupByPoint(jsonArray: FormBData[]): GroupedFormBData {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return jsonArray.reduce((result: any, item) => {
	  const key = `${item.point_id}`;
	  if (!result[key]) {
		result[key] = [];
	  }
	  result[key].push(item);
	  return result as GroupedFormBData;
	}, {});
  }
  

export function handleExcelDownload(id: string) {
	const type: BookType = 'xlsx'; 
	const fn: string = 'Report.xlsx'; 
	const dl: boolean = false; 
	const elt = document.getElementById(id);
	
	if (elt) {
	  const wb = XLSX.utils.table_to_book(elt, { sheet: "Program-level" });
	  return dl ?
		XLSX.write(wb, { bookType: type, bookSST: true, type: 'base64' }) :
		XLSX.writeFile(wb, fn || ('Report.' + (type || 'xlsx')));
	} else {
	  console.error("element not found.");
	}
	
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function jsonToExcelExcelJsForAssignAnchor(jsonData: any, fileName: string, sheetName: string) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    // Add headers
    const headers = Object.keys(jsonData[0]);
    worksheet.addRow(headers);

    // Add data rows
    jsonData.forEach((row: { [s: string]: unknown; } | ArrayLike<unknown>) => {
		console.log("row:::::::::::", row);
		
        const values = Object.values(row);
        worksheet.addRow(values)
	});
	console.log("worksheet:::::::::", worksheet);

	// Add data validation for Active column
	const isProgramAnchorColumn = worksheet.getColumn('E');
	isProgramAnchorColumn.eachCell((cell, rowNumber) => {
		if (rowNumber > 1) {
			cell.dataValidation = {
				type: 'list',
				allowBlank: false,
				formulae: ['"TRUE,FALSE"']
			};
		}
	});

	// Add data validation for Active column
	const isCourseAnchorColumn = worksheet.getColumn('F');
	isCourseAnchorColumn.eachCell((cell, rowNumber) => {
		if (rowNumber > 1) {
			cell.dataValidation = {
				type: 'list',
				allowBlank: false,
				formulae: ['"TRUE,FALSE"']
			};
		}
	});

	// Save the workbook
    const filePath = `${fileName}.xlsx`;
    const buffer = await workbook.xlsx.writeBuffer({
		filename: filePath,
	});

	const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Create a temporary URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a link element
    const link = document.createElement('a');

    // Set the link's href to the URL of the Blob
    link.href = url;

    // Set the filename for the download
    link.download = fileName;

    // Append the link to the body
    document.body.appendChild(link);

    // Programmatically trigger a click event on the link to start the download
    link.click();

    // Cleanup: remove the link and revoke the URL
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log(`Excel file "${filePath}" created successfully.`);
}