"use client";
import Header from "@/components/Header";
import { Input } from "@/components/ui/input";
import { useAppContext } from "@/contexts/AppContext";
import { useInitData } from "@/hooks/useServerData";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import { bonus_data } from "@/config/constants";

interface CalculationData {
  capacity: string;
  operatingDays: string;
  avgBasicUnitPrice: string;
  additionUnitPrice: string;
  additionAchievementDays: string;
  avgActualUsers: string;
  variableCost: string;
  fixedCost: string;
}

export default function Home() {
  const [data, setData] = useState<CalculationData>({
    capacity: '55',
    operatingDays: '269',
    avgBasicUnitPrice: '0',
    additionUnitPrice: '1000',
    additionAchievementDays: '200',
    avgActualUsers: '50.86',
    variableCost: '1200',
    fixedCost: '72000000',
  });

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [fileName, setFileName] = useState("");

  const { regDate, initData } = useAppContext();
  const { initData: fetchedInitData, isLoading: isLoadingInitData, error: fetchError } = useInitData(regDate);

  const getAvgBasicUnitPrice = () => {
    const data = fetchedInitData || initData;
    const selectedServices = data.selected_services?.basic_remuneration ?? [];
    const valueSum = selectedServices.reduce((sum, service) => sum + (service.quantity ?? 0), 0);
    const priceSum = selectedServices.reduce(
      (sum, service) => sum + (service.unitPrice || 0) * (service.quantity ?? 0),
      0
    );
    const countryLevel = Number(data.country_level || 0);
    if (valueSum <= 0 || countryLevel <= 0) {
      return 0;
    }
    return (priceSum * countryLevel) / valueSum;
  };

  useEffect(() => {
    const avgPrice = getAvgBasicUnitPrice();

    setData(prev => ({
      ...prev,
      avgBasicUnitPrice: avgPrice.toString(),
    }));
  }, [fetchedInitData, initData]);

  const handleInputChange = (field: keyof CalculationData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const formatNumber = (value: string): number => parseFloat(value) || 0;

  // Calculate values
  const capacity = formatNumber(data.capacity);
  const operatingDays = formatNumber(data.operatingDays);
  const avgBasicUnitPrice = formatNumber(data.avgBasicUnitPrice);
  const additionUnitPrice = formatNumber(data.additionUnitPrice);
  const additionAchievementDays = formatNumber(data.additionAchievementDays);
  const avgActualUsers = formatNumber(data.avgActualUsers);
  const variableCost = formatNumber(data.variableCost);
  const fixedCost = formatNumber(data.fixedCost);

  // Calculations
  const contributionProfitBasic = avgBasicUnitPrice - variableCost;
  const annualContributionProfitBasic = contributionProfitBasic * operatingDays * avgActualUsers;
  const avgBasicUnitPriceOutput = additionUnitPrice;
  const breakEvenPoint = capacity > 0 && avgBasicUnitPrice > 0 ? (fixedCost / (contributionProfitBasic * operatingDays)) : 0;

  const breakEvenOperatingRate = capacity > 0 ? (breakEvenPoint / capacity) * 100 : 0;
  const currentAnnualProfitLoss = annualContributionProfitBasic - fixedCost;
  const additionAnnualIncrease = additionUnitPrice * additionAchievementDays * avgActualUsers;

  const formatCurrency = (value: number) => {
    return value.toLocaleString('ja-JP', { maximumFractionDigits: 0 });
  };

  const formatDecimal = (value: number, decimals: number = 2) => {
    return value.toLocaleString('ja-JP', { maximumFractionDigits: decimals, minimumFractionDigits: decimals });
  };

  const getMinimumDaysToAchieveAddition = () => {
    let minimumDays = 0;
    if (variableCost * avgActualUsers == 0) {
      return minimumDays = -1;
    }
    minimumDays = Math.round((fixedCost - annualContributionProfitBasic) / (additionUnitPrice * avgActualUsers));
    return minimumDays;
  };

  const handleSaveClick = () => {
    // デフォルトファイル名を設定
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 19).replace(/[:-]/g, "").replace("T", "_");
    setFileName(`計算データ_${dateStr}`);
    setShowSaveModal(true);
  };

  const handleSaveCalculationData = async (customFileName?: string) => {
    const minimumDays = getMinimumDaysToAchieveAddition();
    const currentInitData = fetchedInitData || initData;

    // ExcelJSワークブックを作成
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("計算データ");

    // 列幅の設定
    worksheet.getColumn('A').width = 40;
    worksheet.getColumn('B').width = 10;
    worksheet.getColumn('C').width = 15;
    worksheet.getColumn('D').width = 5;
    worksheet.getColumn('E').width = 30;
    worksheet.getColumn('F').width = 10;
    worksheet.getColumn('G').width = 12;
    worksheet.getColumn('H').width = 15;

    // スタイル定義
    const yellowFill = {
      type: 'pattern' as const,
      pattern: 'solid' as const,
      fgColor: { argb: 'FFFF00' } // 黄色
    };

    const borderStyle = {
      top: { style: 'thin' as const },
      bottom: { style: 'thin' as const },
      left: { style: 'thin' as const },
      right: { style: 'thin' as const }
    };

    // A1: タイトル
    const titleCell = worksheet.getCell('A1');
    titleCell.value = ``;
    titleCell.font = { bold: true, size: 12 };
    worksheet.mergeCells('A1:H1');

    // 左側: 入力セクション（A3-C12）
    worksheet.getCell('A3').value = '■入力(黄色セルのみ編集)';
    worksheet.getCell('A3').font = { bold: true };

    const inputLabels = [
      { row: 5, label: '定員 (人)', value: capacity },
      { row: 6, label: '年間稼働日数 (日)', value: operatingDays },
      { row: 7, label: '平均基本単価 (日額・円)', value: avgBasicUnitPrice },
      { row: 8, label: '加算単価 (日額・1人あたり・円)', value: additionUnitPrice },
      { row: 9, label: '加算達成日数 (日)', value: additionAchievementDays },
      { row: 10, label: '平均実利用人数 (人)', value: avgActualUsers },
      { row: 11, label: '変動費 (1人1日・円)', value: variableCost },
      { row: 12, label: '固定費 (年間・円)', value: fixedCost },
      { row: 13, label: '級地区分(%)', value: currentInitData.country_level || 0 },
      { row: 14, label: '処遇改善加算率(%)', value: `${bonus_data[currentInitData.treatment_bonus[0]][0]}/${currentInitData.treatment_bonus[1]}` || 0 },
    ];

    inputLabels.forEach(({ row, label, value }) => {
      const labelCell = worksheet.getCell(`A${row}`);
      labelCell.value = label;
      labelCell.border = borderStyle;

      const valueCell = worksheet.getCell(`C${row}`);
      valueCell.value = value;
      valueCell.fill = yellowFill;
      valueCell.border = borderStyle;
      valueCell.alignment = { horizontal: 'right' };
    });


    // 左側: 計算結果セクション（A15-C25）
    worksheet.getCell('A16').value = '■計算結果';
    worksheet.getCell('A16').font = { bold: true };

    worksheet.getCell('A17').value = '貢献利益 (基本) =基本単価-変動費 (円/人日)';
    worksheet.getCell('A17').border = borderStyle;
    worksheet.getCell('C17').value = contributionProfitBasic;
    worksheet.getCell('C17').border = borderStyle;
    worksheet.getCell('C17').alignment = { horizontal: 'right' };
    worksheet.getCell('C17').numFmt = '#,##0.00';

    worksheet.getCell('A18').value = '年間貢献利益 (基本のみ) (円)';
    worksheet.getCell('A18').border = borderStyle;
    worksheet.getCell('C18').value = annualContributionProfitBasic;
    worksheet.getCell('C18').border = borderStyle;
    worksheet.getCell('C18').alignment = { horizontal: 'right' };
    worksheet.getCell('C18').numFmt = '#,##0';

    worksheet.getCell('A19').value = '損益分岐点人数 (人)';
    worksheet.getCell('A19').border = borderStyle;
    worksheet.getCell('C19').value = breakEvenPoint;
    worksheet.getCell('C19').border = borderStyle;
    worksheet.getCell('C19').alignment = { horizontal: 'right' };
    worksheet.getCell('C19').numFmt = '#,##0';

    worksheet.getCell('A20').value = '損益分岐点稼働率 (%)';
    worksheet.getCell('A20').border = borderStyle;
    worksheet.getCell('C20').value = `${breakEvenOperatingRate}%`;
    worksheet.getCell('C20').border = borderStyle;
    worksheet.getCell('C20').alignment = { horizontal: 'right' };

    worksheet.getCell('A21').value = '現在の年間損益 (基本のみ、償却前) (円)';
    worksheet.getCell('A21').border = borderStyle;
    worksheet.getCell('C21').value = currentAnnualProfitLoss;
    worksheet.getCell('C21').border = borderStyle;
    worksheet.getCell('C21').alignment = { horizontal: 'right' };
    worksheet.getCell('C21').numFmt = '#,##0';

    worksheet.getCell('A23').value = '加算の年間増収 (円)';
    worksheet.getCell('A23').border = borderStyle;
    worksheet.getCell('C23').value = additionAnnualIncrease;
    worksheet.getCell('C23').border = borderStyle;
    worksheet.getCell('C23').alignment = { horizontal: 'right' };
    worksheet.getCell('C23').numFmt = '#,##0';

    worksheet.getCell('A24').value = '加算込み年間損益 (償却前) (円)';
    worksheet.getCell('A24').border = borderStyle;
    worksheet.getCell('C24').value = currentAnnualProfitLoss + additionAnnualIncrease;
    worksheet.getCell('C24').border = borderStyle;
    worksheet.getCell('C24').alignment = { horizontal: 'right' };
    worksheet.getCell('C24').numFmt = '#,##0';

    worksheet.getCell('A25').value = '加算達成に必要な最低日数 (日)';
    worksheet.getCell('A25').border = borderStyle;
    worksheet.getCell('C25').value = minimumDays;
    worksheet.getCell('C25').border = borderStyle;
    worksheet.getCell('C25').alignment = { horizontal: 'right' };
    worksheet.getCell('C25').numFmt = '#,##0';

    worksheet.getCell('A26').value = '不足/余剰達成日数 (現在-必要) (日)';
    worksheet.getCell('A26').border = borderStyle;
    worksheet.getCell('C26').value = additionAchievementDays - (currentAnnualProfitLoss + additionAnnualIncrease);
    worksheet.getCell('C26').border = borderStyle;
    worksheet.getCell('C26').alignment = { horizontal: 'right' };
    worksheet.getCell('C26').numFmt = '#,##0';

    // 右側: 基本報酬セクション（E4-H10）
    worksheet.getCell('E4').value = '【基本報酬】';
    worksheet.getCell('E4').font = { bold: true };

    // 基本報酬を区分ごとに集計
    const basicServices = currentInitData.selected_services?.basic_remuneration || [];
    const gradeGroups: Record<string, { unitPrice: number; totalQuantity: number; totalAmount: number }> = {};
    
    basicServices.forEach((service) => {
      const memberNum = service.member_num || "";
      const grade = memberNum.includes("6") ? "区分6" :
                   memberNum.includes("5") ? "区分5" :
                   memberNum.includes("4") ? "区分4" :
                   memberNum.includes("3") ? "区分3" : "区分2以下";
      
      if (!gradeGroups[grade]) {
        gradeGroups[grade] = { unitPrice: 0, totalQuantity: 0, totalAmount: 0 };
      }
      
      const unitPrice = Number(service.price) || Number(service.unitPrice) || 0;
      const quantity = Number(service.quantity) || 0;
      const amount = unitPrice * quantity;
      
      gradeGroups[grade].unitPrice = unitPrice;
      gradeGroups[grade].totalQuantity += quantity;
      gradeGroups[grade].totalAmount += amount;
    });

    let gradeRow = 6;
    let totalBasicQuantity = 0;
    let totalBasicAmount = 0;

    initData.selected_services?.basic_remuneration?.forEach((service) => {
      const row = gradeRow;
      const quantity = service.quantity || 0;
      const unitPrice = Number(service.price) || Number(service.unitPrice) || 0;
      const amount = unitPrice * quantity;
      
      worksheet.getCell(`E${row}`).value = service.short_content || service.service_name || "";
      worksheet.getCell(`E${row}`).border = borderStyle;
      worksheet.getCell(`F${row}`).value = unitPrice;
      worksheet.getCell(`F${row}`).border = borderStyle;
      worksheet.getCell(`F${row}`).alignment = { horizontal: 'right' };
      worksheet.getCell(`F${row}`).numFmt = '#,##0';
      worksheet.getCell(`G${row}`).value = quantity;
      worksheet.getCell(`G${row}`).border = borderStyle;
      worksheet.getCell(`G${row}`).alignment = { horizontal: 'right' };
      worksheet.getCell(`G${row}`).numFmt = '#,##0';
      worksheet.getCell(`H${row}`).value = amount;
      worksheet.getCell(`H${row}`).border = borderStyle;
      worksheet.getCell(`H${row}`).alignment = { horizontal: 'right' };
      worksheet.getCell(`H${row}`).numFmt = '#,##0';
      totalBasicQuantity += quantity;
      totalBasicAmount += amount;
      gradeRow++;
    });

    // 合計行
    worksheet.getCell(`G${gradeRow}`).value = totalBasicQuantity;
    worksheet.getCell(`G${gradeRow}`).border = borderStyle;
    worksheet.getCell(`G${gradeRow}`).alignment = { horizontal: 'right' };
    worksheet.getCell(`G${gradeRow}`).numFmt = '#,##0';
    worksheet.getCell(`H${gradeRow}`).value = totalBasicAmount;
    worksheet.getCell(`H${gradeRow}`).border = borderStyle;
    worksheet.getCell(`H${gradeRow}`).alignment = { horizontal: 'right' };
    worksheet.getCell(`H${gradeRow}`).numFmt = '#,##0';

    // 右側: 加算セクション（E12-H22）
    worksheet.getCell('E12').value = '【加算】';
    worksheet.getCell('E12').font = { bold: true };

    let additionRow = 13;
    let totalAdditionQuantity = 0;
    let totalAdditionAmount = 0;

    const additionServices = currentInitData.selected_services?.addition || [];
    additionServices.forEach((service) => {
      const unitPrice = Number(service.price) || 0;
      const quantity = service.quantity || 0;
      const amount = unitPrice * quantity;
      
      if (quantity > 0) {
        worksheet.getCell(`E${additionRow}`).value = service.short_content || service.service_name || "";
        worksheet.getCell(`E${additionRow}`).border = borderStyle;
        
        worksheet.getCell(`F${additionRow}`).value = unitPrice;
        worksheet.getCell(`F${additionRow}`).border = borderStyle;
        worksheet.getCell(`F${additionRow}`).alignment = { horizontal: 'right' };
        worksheet.getCell(`F${additionRow}`).numFmt = '#,##0';
        
        worksheet.getCell(`G${additionRow}`).value = quantity;
        worksheet.getCell(`G${additionRow}`).border = borderStyle;
        worksheet.getCell(`G${additionRow}`).alignment = { horizontal: 'right' };
        worksheet.getCell(`G${additionRow}`).numFmt = '#,##0';
        
        worksheet.getCell(`H${additionRow}`).value = amount;
        worksheet.getCell(`H${additionRow}`).border = borderStyle;
        worksheet.getCell(`H${additionRow}`).alignment = { horizontal: 'right' };
        worksheet.getCell(`H${additionRow}`).numFmt = '#,##0';
        
        totalAdditionQuantity += quantity;
        totalAdditionAmount += amount;
        additionRow++;
      }
    });

    // 加算合計行
    worksheet.getCell(`G${additionRow}`).value = totalAdditionQuantity;
    worksheet.getCell(`G${additionRow}`).border = borderStyle;
    worksheet.getCell(`G${additionRow}`).alignment = { horizontal: 'right' };
    worksheet.getCell(`G${additionRow}`).numFmt = '#,##0';
    worksheet.getCell(`H${additionRow}`).value = totalAdditionAmount;
    worksheet.getCell(`H${additionRow}`).border = borderStyle;
    worksheet.getCell(`H${additionRow}`).alignment = { horizontal: 'right' };
    worksheet.getCell(`H${additionRow}`).numFmt = '#,##0';

    // 級地区分（E24-H24）
    worksheet.getCell('E24').value = '級地区分';
    worksheet.getCell('E24').border = borderStyle;
    worksheet.getCell('G24').value = currentInitData.country_level || 0;
    worksheet.getCell('G24').border = borderStyle;
    worksheet.getCell('G24').alignment = { horizontal: 'right' };
    worksheet.getCell('G24').numFmt = '#,##0.00';
    worksheet.getCell('H24').value = (totalBasicAmount+totalAdditionAmount) * (currentInitData.country_level || 1);
    worksheet.getCell('H24').border = borderStyle;
    worksheet.getCell('H24').alignment = { horizontal: 'right' };
    worksheet.getCell('H24').numFmt = '#,##0';

    // ファイル名を設定
    const finalFileName = customFileName 
      ? (customFileName.endsWith('.xlsx') ? customFileName : `${customFileName}.xlsx`)
      : (() => {
          const now = new Date();
          const dateStr = now.toISOString().slice(0, 19).replace(/[:-]/g, "").replace("T", "_");
          return `計算データ_${dateStr}.xlsx`;
        })();

    // Excelファイルをダウンロード
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = finalFileName;
    link.click();
    window.URL.revokeObjectURL(url);
    
    setShowSaveModal(false);
  };

  const handleSaveConfirm = () => {
    if (fileName.trim()) {
      handleSaveCalculationData(fileName.trim());
    } else {
      handleSaveCalculationData();
    }
  };

  return (
    <>
      <Header />
      {/* 保存モーダル */}
      {showSaveModal && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowSaveModal(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-gray-800">ファイル名を入力</h2>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                ファイル名
              </label>
              <Input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="計算データ_20250101_120000"
                className="w-full"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveConfirm();
                  } else if (e.key === 'Escape') {
                    setShowSaveModal(false);
                  }
                }}
              />
              <p className="text-xs text-gray-500">
                .xlsx 拡張子は自動で追加されます
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                onClick={() => setShowSaveModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                キャンセル
              </Button>
              <Button
                onClick={handleSaveConfirm}
                className="bg-main hover:bg-blue-700 text-white"
              >
                保存
              </Button>
            </div>
          </div>
        </div>
      )}
      <main className="w-full bg-gray-100 py-4 md:py-4 px-4 md:px-16 main-height">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 space-y-4 md:space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
              <h1 className="text-lg md:text-xl font-bold text-gray-800">入力(黄色セルのみ編集)</h1>
              <div className="flex gap-3 w-full md:w-auto">
                <Button className="w-full md:w-32 h-10 bg-main hover:bg-blue-700 text-white" onClick={handleSaveClick}>
                  保 管
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Input Section */}
              <div className="space-y-3 md:space-y-2">
                <div className="flex justify-between items-center py-1 border-b border-dotted">
                  <span className="text-xs md:text-sm text-gray-700">定員 (人)</span>
                  {/* <span className="text-xs md:text-sm font-medium">{data.capacity}</span> */}
                  <Input
                    type="number"
                    value={data.capacity}
                    onChange={(e) => handleInputChange('capacity', e.target.value)}
                    className="w-24 md:w-32 h-8 text-right bg-yellow-50 border-yellow-300 text-xs md:text-sm border focus:ring-1 focus:ring-yellow-200 focus:border-yellow-400"
                  />
                </div>
                <div className="flex justify-between items-center py-1 border-b border-dotted">
                  <span className="text-xs md:text-sm text-gray-700">年間稼働日数 (日)</span>
                  <Input
                    type="number"
                    value={data.operatingDays}
                    onChange={(e) => handleInputChange('operatingDays', e.target.value)}
                    className="w-24 md:w-32 h-8 text-right bg-yellow-50 border-yellow-300 text-xs md:text-sm border focus:ring-1 focus:ring-yellow-200 focus:border-yellow-400"
                  />
                  {/* <span className="text-xs md:text-sm font-medium">{data.operatingDays}</span> */}
                </div>
                <div className="flex justify-between items-center py-1 border-b border-dotted">
                  <span className="text-xs md:text-sm text-gray-700">平均基本単価 (日額・円)</span>
                  <span className="text-xs md:text-sm font-medium">{formatDecimal(avgBasicUnitPrice)}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-dotted">
                  <span className="text-xs md:text-sm text-gray-700">加算単価 (日額・1人あたり・円)</span>
                  <Input
                    type="number"
                    value={data.additionUnitPrice}
                    onChange={(e) => handleInputChange('additionUnitPrice', e.target.value)}
                    className="w-24 md:w-32 h-8 text-right bg-yellow-50 border-yellow-300 text-xs md:text-sm border focus:ring-1 focus:ring-yellow-200 focus:border-yellow-400"
                  />
                </div>
                <div className="flex justify-between items-center py-1 border-b border-dotted">
                  <span className="text-xs md:text-sm text-gray-700">加算達成日数 (日)</span>
                  <Input
                    type="number"
                    value={data.additionAchievementDays}
                    onChange={(e) => handleInputChange('additionAchievementDays', e.target.value)}
                    className="w-24 md:w-32 h-8 text-right bg-yellow-50 border-yellow-300 text-xs md:text-sm border focus:ring-1 focus:ring-yellow-200 focus:border-yellow-400"
                  />
                </div>
                <div className="flex justify-between items-center py-1 border-b border-dotted">
                  <span className="text-xs md:text-sm text-gray-700">平均実利用人数 (人)</span>
                  {/* <span className="text-xs md:text-sm font-medium">{formatDecimal(avgActualUsers)}</span> */}
                  <Input
                    type="number"
                    value={data.avgActualUsers}
                    onChange={(e) => handleInputChange('avgActualUsers', e.target.value)}
                    className="w-24 md:w-32 h-8 text-right bg-yellow-50 border-yellow-300 text-xs md:text-sm border focus:ring-1 focus:ring-yellow-200 focus:border-yellow-400"
                  />
                </div>
                <div className="flex justify-between items-center py-1 border-b border-dotted">
                  <span className="text-xs md:text-sm text-gray-700">変動費 (1人1日・円)</span>
                  <Input
                    type="number"
                    value={data.variableCost}
                    onChange={(e) => handleInputChange('variableCost', e.target.value)}
                    className="w-24 md:w-32 h-8 text-right bg-yellow-50 border-yellow-300 text-xs md:text-sm border focus:ring-1 focus:ring-yellow-200 focus:border-yellow-400"
                  />
                </div>
                <div className="flex justify-between items-center py-2 border-b border-dotted">
                  <span className="text-xs md:text-sm text-gray-700">固定費 (年間・円)</span>
                  <Input
                    type="number"
                    value={data.fixedCost}
                    onChange={(e) => handleInputChange('fixedCost', e.target.value)}
                    className="w-24 md:w-32 h-8 text-right bg-yellow-50 border-yellow-300 text-xs md:text-sm border focus:ring-1 focus:ring-yellow-200 focus:border-yellow-400"
                  />
                </div>
              </div>

              {/* Output Section */}
              <div className="space-y-3 md:space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-dotted">
                  <span className="text-xs md:text-sm text-gray-700">貢献利益 (基本)</span>
                  <span className="text-xs md:text-sm font-medium">{formatDecimal(contributionProfitBasic)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-dotted">
                  <span className="text-xs md:text-sm text-gray-700">年間貢献利益 (基本のみ) (円)</span>
                  <span className="text-xs md:text-sm font-medium">{formatCurrency(annualContributionProfitBasic)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-dotted">
                  <span className="text-xs md:text-sm text-gray-700">平均基本単価 (日額・円)</span>
                  <span className="text-xs md:text-sm font-medium">{formatDecimal(avgBasicUnitPriceOutput)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-dotted">
                  <span className="text-xs md:text-sm text-gray-700">損益分岐点人数 (人)</span>
                  <span className="text-xs md:text-sm font-medium">{formatDecimal(breakEvenPoint, 1)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-b border-dotted">
                  <span className="text-xs md:text-sm text-gray-700">損益分岐点稼働率 (%)</span>
                  <span className="text-xs md:text-sm font-medium">{formatDecimal(breakEvenOperatingRate)}%</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-dotted">
                  <span className="text-xs md:text-sm text-gray-700">現在の年間損益 (基本のみ、償却前) (円)</span>
                  <span className="text-xs md:text-sm font-medium">{formatCurrency(currentAnnualProfitLoss)}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="max-w-4xl mt-8 mx-auto space-y-6 border border-gray-200 rounded-lg p-4 bg-[#0b7bc822]">
            <h2 className="text-lg md:text-xl font-bold text-gray-800">加算込み損益(償却前)</h2>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-md md:text-sm text-gray-700">加算の年間増収 (円)</span>
              <span className="text-lg md:text-md font-medium">{formatCurrency(additionAnnualIncrease)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-md md:text-sm text-gray-700">加算込み年間損益(償却前) (円)</span>
              <span className="text-lg md:text-md font-medium">{formatCurrency(currentAnnualProfitLoss + additionAnnualIncrease)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-md md:text-sm text-gray-700">加算達成に必要な最低日数(日)</span>
              <span className="text-lg md:text-md font-medium">{getMinimumDaysToAchieveAddition()}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-md md:text-sm text-gray-700">不足/余剰達成日数(現在−必要)(日)</span>
              <span className="text-lg md:text-md font-medium">{formatCurrency(additionAchievementDays - (currentAnnualProfitLoss + additionAnnualIncrease))}</span>
            </div>
          </div>
        </div>

      </main>
    </>
  );
} 
