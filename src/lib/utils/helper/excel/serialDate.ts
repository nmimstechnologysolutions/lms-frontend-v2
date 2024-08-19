// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function excelSerialToDate(serial: any) {

	if(serial === '') return '';
	
	if (typeof serial !== 'number' && serial?.includes('-')) {
		return serial;
	}

	if (serial) {
		const utcDays = Math.floor(serial - 25569);
		const utcValue = utcDays * 86400; // 86400 seconds in a day
		const dateInfo = new Date(utcValue * 1000);

		const year = dateInfo.getFullYear();
		const month = dateInfo.getMonth() + 1;
		const day = dateInfo.getDate();
		if(isNaN(year)) return null
		console.log(
			'exceldate::::::::::',
			`${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`
		);
		return `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
	} 
	return null
}
