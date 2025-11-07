# Living Care Service Fee Simulator

This README provides two complete guides—one in English and one in Japanese—so you can share the document directly with any stakeholders. Each language section contains the same topics and level of detail.

## Table of Contents
- [English Guide](#english-guide)
  - [Overview](#overview)
  - [Key Features](#key-features)
  - [System Requirements](#system-requirements)
  - [Setup for Administrators](#setup-for-administrators)
  - [Daily Use](#daily-use)
  - [Good Practices](#good-practices)
  - [Troubleshooting](#troubleshooting)
  - [Project Structure](#project-structure)
  - [Support](#support)
  - [Data Handling](#data-handling)
- [日本語ガイド](#日本語ガイド)
  - [概要](#概要)
  - [主な機能](#主な機能)
  - [動作環境](#動作環境)
  - [管理者向けセットアップ](#管理者向けセットアップ)
  - [日常的な使い方](#日常的な使い方)
  - [安全に利用するコツ](#安全に利用するコツ)
  - [トラブルシューティング](#トラブルシューティング)
  - [プロジェクト構成](#プロジェクト構成)
  - [サポート窓口](#サポート窓口)
  - [データ取扱い](#データ取扱い)

---

## 日本語ガイド

### 概要
生活介護サービス費シミュレーターは、プログラミング不要で使える事業所向けのウェブツールです。以下の目的で活用できます。
- 年間損益と損益分岐点を素早く把握する。
- 各種加算を付けた場合の効果を試算する。
- 昨年度・今年度・目標の 3 期間を比較する。
- 厚生労働省が公表する生活介護サービスコードを検索する。

### 主な機能
- **基本設定の保存**: 単価・人数・級地区分などを日付ごとに登録し、何度でも再利用できます。
- **シミュレーション**: 稼働日数・利用者数・費用を調整し、さまざまなケースを検討できます。
- **年度比較**: 昨年度・今年度・目標値を並べて表示し、進捗を可視化します。
- **サービスコード検索**: キーワードと絞り込み条件で公式コード表を素早く検索できます。
- **バイリンガル表示**: アプリ画面のラベルは英語と日本語の併記です。

### 動作環境
- Node.js 18 以上（npm を含む）。
- 最新版の Chrome / Edge / Safari。
- API サーバーが `config/index.ts` の `SERVER_URL`（初期値 `http://localhost:5000`）で利用可能であること。

### 管理者向けセットアップ
初期導入や更新時のみ、以下の手順を実施してください。

1. **依存パッケージのインストール**
   ```bash
   npm install
   ```
2. **API 接続先の設定**
   - 既定値は `http://localhost:5000` です。
   - 別サーバーを利用する場合は `config/index.ts` の `SERVER_URL` を変更してください。
3. **ローカル動作確認**
   ```bash
   npm run dev
   ```
   ブラウザーで `http://localhost:3000` を開き、動作確認を行います。
4. **本番用ビルド（任意）**
   ```bash
   npm run build
   npm run start
   ```
5. **本番環境へのデプロイ**
   Vercel などのホスティングや自社サーバーなど、組織のルールに沿って運用環境へ配置してください。

### 日常的な使い方
定期的な確認や更新の際は、次の順番で操作します。

1. **ホーム画面**
   - 指定された URL を開くと、4 つのカードが表示されます。
   - 使いたい機能（基本設定・シミュレーション・比較・サービスコード検索）を選択します。

2. **基本設定 (`/init`)**
   - 管理したい日付を選びます。日付ごとに設定が保存されます。
   - 報酬区分・加算項目の利用者数と単価を入力すると、合計が自動計算されます。
   - 級地区分を指定すると、適切な掛け率が反映されます。
   - `設定` ボタンで保存し、緑色の確認メッセージが出れば完了です。

3. **損益分岐点と加算効果 (`/calculate`)**
   - 黄色のセルが入力欄です。定員、年間稼働日数、加算単価、平均利用人数、固定費・変動費などを入力してください。
   - 基本単価は基本設定の値を自動的に参照します。
   - 画面右側に、貢献利益・年間損益・損益分岐点（人数・稼働率）・各加算の効果が表示されます。
   - 目標値に近づくよう、黄色セルの値を調整します。

4. **年度比較 (`/comparison`)**
   - 昨年度・今年度・目標の数値を黄色セルに入力します。
   - `比較` ボタンを押すと、損益や加算増収の差分が色分けされて表示されます。
   - 改善すべきポイントがひと目で把握できます。

5. **サービスコード検索 (`/service`)**
   - 検索バーにキーワード（コード、サービス名、備考など）を入力します。
   - サービスタイプ、利用人数、時間帯、カテゴリで絞り込みができます。
   - 結果はページング付きの表で表示され、件数変更やページ移動が可能です。
   - 行をクリックすると、備考や条件など詳細情報を確認できる場合があります。

### 安全に利用するコツ
- 複数のスタッフで端末を共有する場合は、重要な数値を定期的に書き出すか、共有ルールを決めてください。
- API 接続先を変更したときは、ブラウザーを再読み込みして新しい設定を反映させてください。
- 基本設定の内容を定期的に見直し、最新の契約内容（単価・人数）に合わせて更新してください。

### トラブルシューティング
- **API に接続できない**: バックエンドサーバーが起動しているか、`SERVER_URL` が正しいか確認してください。
- **計算結果が想定と違う**: 基本設定で選択した日付と、シミュレーションで参照している日付が同じか確認します。
- **画面が表示されない／乱れる**: ブラウザーのキャッシュを削除するか、他のブラウザーで再度お試しください。それでも解決しない場合は、開発チームへスクリーンショット付きでご連絡ください。

### プロジェクト構成
```
app/                # Next.js App Router ページ
components/         # UI コンポーネント（テーブル、セレクター、ヘッダーなど）
contexts/           # フィルターや保存データなどの共有ステート
hooks/              # API にアクセスするためのカスタムフック
config/             # SERVER_URL などフロントエンドの設定
```

### サポート窓口
- **業務・数値の相談**: 担当コンサルタントまたはプロジェクト責任者にお問い合わせください。
- **技術的な問題**: 通常のサポート窓口から開発チームへ連絡してください。スクリーンショットや再現手順を添えると対応が早くなります。

### データ取扱い
- 個人情報は入力不要で、事業所レベルの数値のみを扱います。
- 保存データはブラウザーのローカルストレージと、設定した場合は組織内のバックエンドサーバーに保管されます。
- 数値を共有する際は、組織の情報セキュリティポリシーに従ってください。

---

## English Guide

### Overview
The Living Care Service Fee Simulator is a web tool for facility managers who need to understand financial performance without writing code. It helps you:
- Estimate annual profit or loss and identify break-even points.
- Measure the financial impact of optional additions (加算).
- Compare last year, this year, and target plans.
- Search the official living care service code list published by Japan’s Ministry of Health, Labour and Welfare.

### Key Features
- **Centralised basic settings**: Save core information (unit prices, headcount, area level) by date.
- **Scenario simulation**: Adjust operating days, staffing, and costs to test “what if” cases.
- **Yearly comparison**: Visualise progress and gaps at a glance.
- **Service code search**: Find codes quickly using keywords and filters.
- **Bilingual interface**: Labels inside the app appear in both English and Japanese.

### System Requirements
- Node.js 18 or later (includes npm).
- Modern browser: Chrome, Edge, or Safari in a current version.
- Backend API available at the configured `SERVER_URL` (default `http://localhost:5000`).

### Setup for Administrators
These steps are required only when installing or updating the system.

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Configure the API endpoint**
   - Default: `http://localhost:5000`.
   - Change `SERVER_URL` inside `config/index.ts` to match your backend location.
3. **Run locally for validation**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` to confirm the app works.
4. **Build for production (optional)**
   ```bash
   npm run build
   npm run start
   ```
5. **Deploy** to your hosting environment (e.g., Vercel, on-prem server) following your organisation’s policies.

### Daily Use
Follow these steps whenever you review or update planning figures.

1. **Home Dashboard**
   - Visit your deployed URL.
   - Choose one of the four cards (Basic Settings, Simulation, Comparison, Service Code Search).

2. **Basic Settings (`/init`)**
   - Select the management date (each date stores its own data set).
   - Fill in user counts, unit prices, and addition values. Totals update automatically.
   - Set the area level multiplier (級地区分).
   - Click `設定` to save. A green confirmation message appears.

3. **Break-even & Addition Simulation (`/calculate`)**
   - Yellow fields are editable: capacity, operating days, addition unit prices, average users, fixed and variable costs.
   - The simulator reuses the base unit price from Basic Settings.
   - Results on the right include contribution profit, annual profit/loss, break-even headcount, operating rate, and addition effects.
   - Adjust inputs until the KPIs meet your targets.

4. **Yearly Comparison (`/comparison`)**
   - Enter last year, this year, and target figures in the yellow columns.
   - Click `比較` to calculate totals and differences.
   - Positive and negative results are colour-coded to highlight improvement areas.

5. **Service Code Search (`/service`)**
   - Search by code, service name, or note; add filters for type, member count, time slot, and category.
   - Browse the paginated table; adjust rows per page or move forward/backward.
   - Click a row for detailed notes when available.

### Good Practices
- Keep a shared record (spreadsheet or PDF) if multiple staff edit the same data.
- Refresh the browser after changing API settings or switching management dates.
- Review Basic Settings regularly to ensure unit prices and headcounts reflect current contracts.

### Troubleshooting
- **Cannot connect to the API**: Confirm the backend server is running and the `SERVER_URL` is correct.
- **Unexpected figures**: Verify that the selected date in Basic Settings matches the scenario you are simulating.
- **Display issues**: Clear browser cache or try another browser. If the problem persists, contact the development team with screenshots and steps.

### Project Structure
```
app/                # Next.js App Router pages
components/         # UI components (tables, selectors, headers)
contexts/           # Shared state such as filters and saved settings
hooks/              # Data-fetch hooks for API access
config/             # Frontend configuration (e.g., SERVER_URL)
```

### Support
- **Business or financial questions**: Contact your project manager or consultant.
- **Technical issues**: Use your standard support channel to reach the development team. Include screenshots and reproduction steps to speed up assistance.

### Data Handling
- Only facility-level operational figures are stored; no personal service user data is required.
- Data is saved in browser local storage and, if configured, on your organisation’s backend server.
- Follow internal policies when exporting numbers or sharing screenshots.

---
