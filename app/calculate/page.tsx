"use client";
import Header from "@/components/Header";
import { Input } from "@/components/ui/input";
import { useAppContext } from "@/contexts/AppContext";
import { useInitData } from "@/hooks/useServerData";
import { useEffect, useState } from "react";

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

  return (
    <>
      <Header />
      <main className="w-full bg-gray-100 py-4 md:py-4 px-4 md:px-16 main-height">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 space-y-4 md:space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
              <h1 className="text-lg md:text-xl font-bold text-gray-800">入力(黄色セルのみ編集)</h1>
              {/* <div className="flex gap-3 w-full md:w-auto">
                <Button className="w-full md:w-32 h-10 bg-main hover:bg-blue-700 text-white">
                  保 管
                </Button>
              </div> */}
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
