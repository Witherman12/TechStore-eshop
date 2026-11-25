import { expect, test } from '@playwright/test';

test.describe('Authentication E2E Flow', () => {
  test('register, persist session on reload, logout, handle wrong login and login again', async ({
    page,
  }) => {
    const uniqueSuffix = Date.now().toString().slice(-6);
    const username = `e2e_${uniqueSuffix}`;
    const email = `e2e_${uniqueSuffix}@techstore.gr`;
    const password = 'Password123!';

    // 1. Εγγραφή νέου χρήστη
    await page.goto('/register');
    await page.fill('#register-username', username);
    await page.fill('#register-email', email);
    await page.fill('#register-password', password);
    await page.fill('#register-confirm-password', password);
    await page.getByRole('button', { name: 'Δημιουργία λογαριασμού' }).click();

    await expect(page).toHaveURL('/');
    await expect(
      page.getByText(`Ο λογαριασμός "${username}" δημιουργήθηκε με επιτυχία!`)
    ).toBeVisible();
    await expect(page.locator('header')).toContainText(username);
    await expect(page.locator('header')).toContainText('Customer');

    // 2. Διατήρηση συνεδρίας μετά από refresh (/api/auth/me)
    await page.reload();
    await expect(page.locator('header')).toContainText(username);
    await expect(page.locator('header')).toContainText('Customer');

    // 3. Αποσύνδεση
    await page.locator('header').getByRole('button', { name: 'Αποσύνδεση' }).click();
    await expect(page.locator('header').getByRole('link', { name: 'Σύνδεση' })).toBeVisible();

    // 4. Αποτυχημένη σύνδεση με λάθος κωδικό
    await page.goto('/login');
    await page.fill('#login-username', username);
    await page.fill('#login-password', 'WrongPass!');
    await page.getByRole('button', { name: 'Σύνδεση' }).click();
    await expect(page.locator('.alert-error')).toBeVisible();

    // 5. Επιτυχής σύνδεση με τα σωστά στοιχεία
    await page.fill('#login-password', password);
    await page.getByRole('button', { name: 'Σύνδεση' }).click();

    await expect(page).toHaveURL('/');
    await expect(
      page.getByText(`Επιτυχής σύνδεση! Καλώς ήρθες, ${username}.`)
    ).toBeVisible();
    await expect(page.locator('header')).toContainText(username);
  });
});