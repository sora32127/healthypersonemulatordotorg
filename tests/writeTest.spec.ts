import { test, expect, Page } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

const testURL = process.env.TEST_URL;
if (!testURL) {
  throw new Error("TEST_URLが環境変数に設定されていません");
}

const nowDateTime = new Date().toISOString();

async function gotoTestPostPage(page: Page, pattern: string = "MG") {
  await page.goto(`${testURL}`);
  await expect(page).toHaveTitle(/トップページ/);
  let postLink;
  if (pattern == "SB"){
    postLink = await page.getByRole('link', { name: /プログラムテスト-SB/});
    
  } else {
    postLink = await page.getByRole('link', { name: /プログラムテスト-MG/});
  }
  const postUrl = await postLink.getAttribute('href');
  if (postUrl) {
    await page.goto(`${testURL}${postUrl}`);
  }
  await expect(page).toHaveTitle(/プログラムテスト/);
}

async function login(page: Page) {
  await page.getByText('編集する').click();
  await expect(page).toHaveTitle(/ログイン/);
  const loginTestEmail = process.env.LOGIN_TEST_EMAIL;
  const loginTestPassword = process.env.LOGIN_TEST_PASSWORD;
  if (!loginTestEmail || !loginTestPassword) {
    throw new Error("ログイン情報が環境変数に設定されていません");
  }
  await page.getByLabel("メールアドレス:").fill(loginTestEmail);
  await page.getByLabel("パスワード:").fill(loginTestPassword);
  await page.getByRole('button', { name: 'ログイン' }).click();
}

test.describe('ユーザーはテンプレートから記事を投稿できる', () => {
  test.setTimeout(960000);
  test.beforeEach(async ({ page }) => {
    await page.goto(`${testURL}/post`);
    await expect(page).toHaveTitle(/投稿/);
  });

  test('最小限の要素を入力して投稿 * 結果悪 * タグ作成なし', async ({ page }) => {
    await page.getByText("結果悪").click();
    await page.getByLabel("Who").fill('S1');
    await page.locator(".健常行動ブレイクポイント-0").fill('R1');
    await page.locator(".どうすればよかったか-0").fill('CR1');
    await page.locator(".タイトル-0").fill(`プログラムテスト-SB-${nowDateTime}`);
    await page.getByRole('button', { name: '投稿する' }).click();

    await gotoTestPostPage(page, "SB");
  });

  test('最大限の要素を入力して投稿 * 結果善 * タグ作成あり', async ({ page }) => {
    await page.getByText("結果善").click();
    await page.getByLabel("Who").fill('S1');
    await page.getByLabel("When").fill('S2');
    await page.getByLabel("Where").fill('S3');
    await page.getByLabel("Why").fill('S4');
    await page.getByLabel("What").fill('S5');
    await page.getByLabel("How").fill('S6');
    await page.getByLabel("Then").fill('S7');

    await page.getByText("テキスト入力を追加").click();
    await page.locator('#input-0').fill('A1');
    await page.getByText("テキスト入力を追加").click();
    await page.locator('#input-1').fill('A2');
    await page.getByText("テキスト入力を追加").click();
    await page.locator('#input-2').fill('A3');

    await page.locator(".なぜやってよかったのか-0").fill('R1');
    await page.locator(".なぜやってよかったのか-1").fill('R2');
    await page.locator(".なぜやってよかったのか-2").fill('R3');

    await page.locator(".やらなかったらどうなっていたか-0").fill('CR1');
    await page.locator(".やらなかったらどうなっていたか-1").fill('CR2');
    await page.locator(".やらなかったらどうなっていたか-2").fill('CR3');

    await page.locator(".備考-0").fill('N1');
    await page.locator(".備考-1").fill('N2');
    await page.locator(".備考-2").fill('N3');

    await page.getByText(/やってはいけないこと/).click();
    await page.getByText(/T.M.Revolution/).click();
    await page.getByText(/やったほうがよいこと/).click();

    await page.locator(".タイトル-0").fill(`プログラムテスト-MG-${nowDateTime}`);
    await page.locator(".tag-create-box-input").fill(`タグ作成テスト-${nowDateTime}`);
    await page.getByText('タグを作成').click();

    await page.getByRole('button', { name: '投稿する' }).click();
    await gotoTestPostPage(page);
  });
});

test.describe("ユーザーはログインして記事を編集できる", () => {
  test.setTimeout(480000);
  test.describe.configure({ retries: 2 });

  test("ユーザーはログインしていない状態で記事を編集できない", async ({ page }) => {
    await gotoTestPostPage(page);
    await page.getByText('編集する').click();
    await expect(page).toHaveTitle(/ログイン/);
  });

  test("ユーザーはログインして編集ページに移動できる", async ({ page }) => {
    await gotoTestPostPage(page);
    await login(page);
    await expect(page).toHaveTitle(/編集/);
  });

  test("ユーザーは記事を編集できる", async ({ page }) => {
    await gotoTestPostPage(page);
    await login(page);
    await expect(page).toHaveTitle(/編集/);
    const newPostName = `プログラムテスト-MG-${nowDateTime}-編集後`;
    await page.locator(".edit-post-title").clear();
    await page.locator(".edit-post-title").fill(newPostName);

    await page.locator(".edit-tag-search-input").fill("Twi");
    await page.getByText(/Twitter/).click();
    await page.locator(".edit-tag-remove-button").nth(1).click();

    await page.locator(".w-md-editor-text-input").clear();
    await page.locator(".w-md-editor-text-input").fill("本文を編集しました");
    await page.locator(".edit-post-submit-button").click();

    await gotoTestPostPage(page);
  });
});

test("ユーザーは記事に対していいね・よくないねをすることができる", async ({ page }) => {
  await gotoTestPostPage(page);
  await page.getByRole('button', { name: 'Like 0', exact: true }).click();
  await page.getByRole('button', { name: 'Dislike 0', exact: true }).click();
  await expect(page).toHaveTitle(/プログラムテスト/);
});

test("ユーザーは記事にコメントし、コメントに対していいね・よくないねができる", async ({ page }) => {
  await gotoTestPostPage(page);
  await page.getByLabel('コメント').fill('Test Comment');
  await page.getByRole('button', { name: 'コメント' }).click();
  await expect(page).toHaveTitle(/プログラムテスト/);
  await page.getByRole('button', { name: 'Like 0', exact: true }).click();
  await page.getByRole('button', { name: 'Dislike 0', exact: true }).click();
  await expect(page).toHaveTitle(/プログラムテスト/);
});