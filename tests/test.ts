import { expect, test } from '@playwright/test';

test('Dashboard table has 10 rows', async ({ page }) => {
	await page.goto('/dashboard');
	const tableRowsCount = await page.getByRole('table').getByRole('row').count();
	expect(tableRowsCount).toBe(11);
});
