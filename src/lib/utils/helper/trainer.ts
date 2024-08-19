import { driver } from 'driver.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function trainDriver(steps?: any) {
	const driverObj = driver({
		showProgress: true,
		steps: steps
	});

	driverObj.drive();
}
