export function slugToBreadcrumbText(slug: string, url: string) {
	// Split the slug into words
	const words = slug.split('-');

	const lastWord = words[words.length - 1];
	if (words.length === 1 && !isNaN(parseFloat(lastWord))) {
		return (words[words.length - 1] = `${url.includes('view') ? 'View' : 'Edit'} - ${lastWord}`);
	}
	if (words.length === 1 && words[0].length < 4) {
		return words[0].toUpperCase();
	}

	// Capitalize the first letter of each word
	const capitalizedWords = words.map((word) => {
		return word.charAt(0).toUpperCase() + word.slice(1);
	});

	// Join the capitalized words with spaces
	const breadcrumbText = capitalizedWords.join(' ');

	return breadcrumbText;
}

export function findClosestURL(browserURL: string, predefinedURLs: { url: string }[]) {
	let closestURL = null;

	for (const predefinedURL of predefinedURLs) {
		if (browserURL.startsWith(predefinedURL.url)) {
			if (!closestURL || predefinedURL.url.length > closestURL.length) {
				closestURL = predefinedURL.url;
			}
		}
	}

	return closestURL;
}

export function formatDateTime(inputDateTime: string) {
	const inputParts = inputDateTime.split('T');

	if (inputParts.length === 2) {
		// Date with time (e.g., "2023-10-06T14:23")
		const datePart = inputParts[0];
		const timePart = inputParts[1];

		const formattedDate = formatDate(datePart);
		const formattedTime = formatTime(timePart);

		return `${formattedDate} ${formattedTime}`;
	} else if (inputParts.length === 1) {
		// Date without time (e.g., "2023-10-06")
		return formatDate(inputParts[0]);
	}

	// Invalid input return same string
	return inputDateTime;
}

// export function convertISODateToDatetimeLocal(isoDateString: string) {
// 	const dateObject = new Date(isoDateString);
// 	const year = dateObject.getFullYear();
// 	const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
// 	const day = dateObject.getDate().toString().padStart(2, '0');
	
// 	const hours = (dateObject.getHours() + 5).toString().padStart(2, '0');
// 	const minutes = (dateObject.getMinutes() + 30).toString().padStart(2, '0');
  
// 	const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
// 	console.log(formattedDate);
// 	return formattedDate;
// }

function formatDate(date: string) {
	const dateObj = new Date(date);
	const options = { year: 'numeric', month: 'short', day: 'numeric' } as const;
	return dateObj.toLocaleDateString(undefined, options);
}

function formatTime(time: string) {
	const timeObj = new Date(`2000-01-01T${time}`);
	const options = { hour: 'numeric', minute: '2-digit' } as const;
	return timeObj.toLocaleTimeString(undefined, options);
}

export function getAcadyearForOption() {
	const currentYear = new Date().getFullYear();
	const nextYear = currentYear + 1;
	const previousYear = currentYear - 1;
	return [
		{
			value: previousYear + '',
			label: previousYear
		},
		{
			value: currentYear + '',
			label: currentYear
		},
		{
			value: nextYear + '',
			label: nextYear
		}
	];
}
