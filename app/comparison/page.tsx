"use client";
import { useState, memo, useCallback } from "react";
import Header from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ComparisonData {
  lastYear: {
    capacity: string;
    operatingDays: string;
    avgBasicUnitPrice: string;
    additionUnitPrice: string;
    additionAchievementDays: string;
    avgActualUsers: string;
    variableCost: string;
    fixedCost: string;
  };
  thisYear: {
    capacity: string;
    operatingDays: string;
    avgBasicUnitPrice: string;
    additionUnitPrice: string;
    additionAchievementDays: string;
    avgActualUsers: string;
    variableCost: string;
    fixedCost: string;
  };
  target: {
    capacity: string;
    operatingDays: string;
    avgBasicUnitPrice: string;
    additionUnitPrice: string;
    additionAchievementDays: string;
    avgActualUsers: string;
    variableCost: string;
    fixedCost: string;
  };
}

export default function Comparison() {
  const [data, setData] = useState<ComparisonData>({
    lastYear: {
      capacity: '40',
      operatingDays: '240',
      avgBasicUnitPrice: '9000',
      additionUnitPrice: '0',
      additionAchievementDays: '0',
      avgActualUsers: '34',
      variableCost: '1200',
      fixedCost: '70000000',
    },
    thisYear: {
      capacity: '40',
      operatingDays: '240',
      avgBasicUnitPrice: '9300',
      additionUnitPrice: '1000',
      additionAchievementDays: '200',
      avgActualUsers: '36',
      variableCost: '1200',
      fixedCost: '72000000',
    },
    target: {
      capacity: '40',
      operatingDays: '240',
      avgBasicUnitPrice: '9900',
      additionUnitPrice: '1200',
      additionAchievementDays: '220',
      avgActualUsers: '37',
      variableCost: '1100',
      fixedCost: '70500000',
    },
  });

  const [showComparison, setShowComparison] = useState(false);
  const [calculatedResults, setCalculatedResults] = useState<{
    lastYear: ReturnType<typeof calculateValues>;
    thisYear: ReturnType<typeof calculateValues>;
    target: ReturnType<typeof calculateValues>;
  } | null>(null);

  const handleInputChange = useCallback((period: keyof ComparisonData, field: string, e: React.ChangeEvent<HTMLInputElement>) => {
    setData(prev => ({
      ...prev,
      [period]: { ...prev[period], [field]: e.target.value }
    }));
    // Reset comparison when inputs change
    setShowComparison(prev => {
      if (prev) {
        setCalculatedResults(null);
        return false;
      }
      return prev;
    });
  }, []);

  const formatNumber = (value: string): number => parseFloat(value) || 0;

  const calculateValues = (period: 'lastYear' | 'thisYear' | 'target') => {
    const d = data[period];
    const capacity = formatNumber(d.capacity);
    const operatingDays = formatNumber(d.operatingDays);
    const avgBasicUnitPrice = formatNumber(d.avgBasicUnitPrice);
    const additionUnitPrice = formatNumber(d.additionUnitPrice);
    const additionAchievementDays = formatNumber(d.additionAchievementDays);
    const avgActualUsers = formatNumber(d.avgActualUsers);
    const variableCost = formatNumber(d.variableCost);
    const fixedCost = formatNumber(d.fixedCost);

    const contributionProfit = avgBasicUnitPrice - variableCost;
    const basicProfitLoss = (contributionProfit * operatingDays * avgActualUsers) - fixedCost;
    const additionRevenue = additionUnitPrice * additionAchievementDays * avgActualUsers;
    const totalProfitLoss = basicProfitLoss + additionRevenue;
    const breakEvenPoint = capacity > 0 && contributionProfit > 0 ? (fixedCost / (contributionProfit * operatingDays)) : 0;
    const breakEvenOperatingRate = capacity > 0 ? (breakEvenPoint / capacity) * 100 : 0;

    return {
      contributionProfit,
      basicProfitLoss,
      additionRevenue,
      totalProfitLoss,
      breakEvenPoint,
      breakEvenOperatingRate,
    };
  };

  const handleComparison = () => {
    // Calculate and store results when button is clicked
    const lastYear = calculateValues('lastYear');
    const thisYear = calculateValues('thisYear');
    const target = calculateValues('target');
    
    setCalculatedResults({
      lastYear,
      thisYear,
      target,
    });
    setShowComparison(true);
  };

  // Use stored calculated results instead of calculating on each render
  const lastYearCalc = calculatedResults?.lastYear || {
    contributionProfit: 0,
    basicProfitLoss: 0,
    additionRevenue: 0,
    totalProfitLoss: 0,
    breakEvenPoint: 0,
    breakEvenOperatingRate: 0,
  };
  const thisYearCalc = calculatedResults?.thisYear || {
    contributionProfit: 0,
    basicProfitLoss: 0,
    additionRevenue: 0,
    totalProfitLoss: 0,
    breakEvenPoint: 0,
    breakEvenOperatingRate: 0,
  };
  const targetCalc = calculatedResults?.target || {
    contributionProfit: 0,
    basicProfitLoss: 0,
    additionRevenue: 0,
    totalProfitLoss: 0,
    breakEvenPoint: 0,
    breakEvenOperatingRate: 0,
  };

  const formatCurrency = (value: number) => value.toLocaleString('ja-JP', { maximumFractionDigits: 0 });
  const formatDecimal = (value: number, decimals: number = 0) => 
    value.toLocaleString('ja-JP', { maximumFractionDigits: decimals, minimumFractionDigits: decimals });

  const inputFields = [
    { key: 'capacity', label: '定員(人)' },
    { key: 'operatingDays', label: '年間稼働日数(日)' },
    { key: 'avgBasicUnitPrice', label: '平均基本単価(日額・円)' },
    { key: 'additionUnitPrice', label: '加算単価(日額・1人あた)' },
    { key: 'additionAchievementDays', label: '加算達成日数(日)' },
    { key: 'avgActualUsers', label: '平均実利用人数(人)' },
    { key: 'variableCost', label: '変動費(1人1日・円)' },
    { key: 'fixedCost', label: '固定費(年間・円)' },
  ];

  const InputRow = memo(({ field, period, value, onInputChange }: { 
    field: typeof inputFields[0]; 
    period: keyof ComparisonData;
    value: string;
    onInputChange: (period: keyof ComparisonData, field: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  }) => {
    const isInputField = ['capacity', 'operatingDays', 'avgBasicUnitPrice', 'avgActualUsers', 'additionUnitPrice', 'additionAchievementDays', 'variableCost', 'fixedCost'].includes(field.key);

    return (
      <td className="px-3 md:px-5 py-2 md:py-2 border-b border-gray-200 border-r border-gray-200 last:border-r-0">
        {isInputField ? (
          <div className="rounded-lg p-1">
            <Input
              type="number"
              value={value}
              onChange={(e) => onInputChange(period, field.key, e)}
              className="w-full h-9 md:h-10 text-xs md:text-sm text-right bg-yellow-50 border-yellow-300 border focus:ring-1 focus:ring-yellow-200 focus:border-yellow-400 rounded-md font-semibold"
            />
          </div>
        ) : (
          <span className="text-xs md:text-sm text-gray-800 text-right block font-medium bg-white px-3 py-2 rounded-md border border-gray-200">{value}</span>
        )}
      </td>
    );
  });

  const formatResultValue = (type: string, lastYear: ReturnType<typeof calculateValues>, thisYear: ReturnType<typeof calculateValues>, target: ReturnType<typeof calculateValues>) => {
    if (type === 'contributionProfit') {
      return [formatDecimal(lastYear.contributionProfit), formatDecimal(thisYear.contributionProfit), formatDecimal(target.contributionProfit)];
    } else if (type === 'basicProfitLoss') {
      return [formatCurrency(lastYear.basicProfitLoss), formatCurrency(thisYear.basicProfitLoss), formatCurrency(target.basicProfitLoss)];
    } else if (type === 'additionRevenue') {
      return [formatCurrency(lastYear.additionRevenue), formatCurrency(thisYear.additionRevenue), formatCurrency(target.additionRevenue)];
    } else if (type === 'breakEvenPoint') {
      return [formatDecimal(lastYear.breakEvenPoint, 1), formatDecimal(thisYear.breakEvenPoint, 1), formatDecimal(target.breakEvenPoint, 1)];
    } else if (type === 'breakEvenOperatingRate') {
      return [formatDecimal(lastYear.breakEvenOperatingRate, 1) + '%', formatDecimal(thisYear.breakEvenOperatingRate, 1) + '%', formatDecimal(target.breakEvenOperatingRate, 1) + '%'];
    }
    return ['', '', ''];
  };

  return (
    <>
      <Header />
      <main className="w-full bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 min-h-screen py-3 md:py-3 px-4 md:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-main px-6 md:px-8 py-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">昨年度 / 今年度 / 目標 の比較</h1>
                  <p className="text-blue-100 text-sm md:text-base">入力→自動計算 (黄色背景のセルのみ編集可能)</p>
                </div>
                <Button
                  onClick={handleComparison}
                  className="w-full md:w-36 h-11 bg-white  hover:bg-gray-100 font-bold shadow-lg hover:shadow-xl transition-all color-main"
                >
                  比&nbsp;&nbsp;較
                </Button>
              </div>
            </div>
            <div className="p-6 md:p-8">

              {/* Input Section */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-main">
                  <div className="w-1 h-6 bg-main rounded-full"></div>
                  <h2 className="text-lg md:text-xl font-bold text-gray-800">入力データ</h2>
                </div>
                <div className="overflow-x-auto border-2 border-gray-300 rounded-xl shadow-lg">
                  <table className="w-full bg-white min-w-[600px]">
                    <thead className="bg-main">
                      <tr>
                        <th className="px-4 md:px-6 py-2 md:py-2 text-left text-sm md:text-base font-bold text-white border-r border-blue-500">項目</th>
                        <th className="px-4 md:px-6 py-2 md:py-2 text-center text-sm md:text-base font-bold text-white border-r border-blue-500">昨年度</th>
                        <th className="px-4 md:px-6 py-2 md:py-2 text-center text-sm md:text-base font-bold text-white border-r border-blue-500">今年度</th>
                        <th className="px-4 md:px-6 py-2 md:py-2 text-center text-sm md:text-base font-bold text-white">目標</th>
                      </tr>
                    </thead>
                    <tbody>
                       {inputFields.map((field) => (
                         <tr key={field.key} className="hover:bg-blue-50 transition-colors">
                           <td className="px-3 md:px-5 md:py-2 border-b border-gray-200 bg-gray-50">
                             <span className="text-xs md:text-sm font-semibold text-gray-700">{field.label}</span>
                           </td>
                           <InputRow 
                             key={`lastYear-${field.key}`} 
                             field={field} 
                             period="lastYear"
                             value={data.lastYear[field.key as keyof typeof data.lastYear]}
                             onInputChange={handleInputChange}
                           />
                           <InputRow 
                             key={`thisYear-${field.key}`} 
                             field={field} 
                             period="thisYear"
                             value={data.thisYear[field.key as keyof typeof data.thisYear]}
                             onInputChange={handleInputChange}
                           />
                           <InputRow 
                             key={`target-${field.key}`} 
                             field={field} 
                             period="target"
                             value={data.target[field.key as keyof typeof data.target]}
                             onInputChange={handleInputChange}
                           />
                         </tr>
                       ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Calculation Results Section */}
              {showComparison && (
              <div>
                <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-main">
                  <div className="w-1 h-6 bg-main rounded-full"></div>
                  <h2 className="text-lg md:text-xl font-bold text-gray-800">計算結果 (年間)</h2>
                </div>
                <div className="overflow-x-auto border-2 border-gray-300 rounded-xl shadow-lg mb-4">
                  <table className="w-full bg-white min-w-[600px]">
                    <thead className="bg-main">
                      <tr>
                        <th className="px-4 md:px-6 py-2 md:py-2 text-left text-sm md:text-base font-bold text-white border-r border-gray-200">指標</th>
                        <th className="px-4 md:px-6 py-2 md:py-2 text-center text-sm md:text-base font-bold text-white border-r border-gray-200">昨年度</th>
                        <th className="px-4 md:px-6 py-2 md:py-2 text-center text-sm md:text-base font-bold text-white border-r border-gray-200">今年度</th>
                        <th className="px-4 md:px-6 py-2 md:py-2 text-center text-sm md:text-base font-bold text-white border-r border-gray-200">目標</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-green-50 transition-colors">
                        <td className="px-3 md:px-5 py-2 md:py-2 border-b border-gray-200 bg-gray-50">
                          <span className="text-xs md:text-sm font-semibold text-gray-700">貢献利益(円/人日)</span>
                        </td>
                        {formatResultValue('contributionProfit', lastYearCalc, thisYearCalc, targetCalc).map((val, idx) => (
                          <td key={idx} className="px-3 md:px-5 py-2 md:py-2 text-right text-xs md:text-sm font-bold text-gray-800 bg-white border-b border-gray-200 border-r border-gray-200 last:border-r-0">{val}</td>
                        ))}
                      </tr>
                      <tr className="hover:bg-blue-50 transition-colors">
                        <td className="px-3 md:px-5 py-2 md:py-2 border-b border-gray-200">
                          <span className="text-xs md:text-sm font-semibold text-gray-700">基本のみ損益(円)</span>
                        </td>
                        {formatResultValue('basicProfitLoss', lastYearCalc, thisYearCalc, targetCalc).map((val, idx) => (
                          <td key={idx} className="px-3 md:px-5 py-2 md:py-2 text-right text-xs md:text-sm font-bold bg-white border-b border-gray-200 border-r border-gray-200 last:border-r-0">{val}</td>
                        ))}
                      </tr>
                      <tr className="hover:bg-purple-50 transition-colors">
                        <td className="px-3 md:px-5 py-2 md:py-2 border-b border-gray-200">
                          <span className="text-xs md:text-sm font-semibold text-gray-700">加算増収(円)</span>
                        </td>
                        {formatResultValue('additionRevenue', lastYearCalc, thisYearCalc, targetCalc).map((val, idx) => (
                          <td key={idx} className="px-3 md:px-5 py-2 md:py-2 text-right text-xs md:text-sm font-bold bg-white border-b border-gray-200 border-r border-gray-200 last:border-r-0">{val}</td>
                        ))}
                      </tr>
                      <tr className="hover:bg-emerald-50 transition-colors">
                        <td className="px-3 md:px-5 py-2 md:py-2 border-b border-gray-200">
                          <span className="text-xs md:text-sm font-semibold text-gray-700">加算込み損益(円)</span>
                        </td>
                        {[lastYearCalc, thisYearCalc, targetCalc].map((calc, idx) => {
                          const isPositive = calc.totalProfitLoss >= 0;
                          return (
                            <td key={idx} className={`px-3 md:px-5 py-2 md:py-2 text-right text-sm md:text-base font-extrabold border-b border-gray-200 border-r border-gray-200 last:border-r-0 ${
                              isPositive ? 'color-main' : 'text-red-700'
                            }`}>
                              {formatCurrency(calc.totalProfitLoss)}
                            </td>
                          );
                        })}
                      </tr>
                      <tr className="hover:bg-orange-50 transition-colors">
                        <td className="px-3 md:px-5 py-2 md:py-2 border-b border-gray-200">
                          <span className="text-xs md:text-sm font-semibold text-gray-700">損益分岐点人数(人)</span>
                        </td>
                        {formatResultValue('breakEvenPoint', lastYearCalc, thisYearCalc, targetCalc).map((val, idx) => (
                          <td key={idx} className="px-3 md:px-5 py-2 md:py-2 text-right text-xs md:text-sm font-bold bg-white border-b border-gray-200 border-r border-gray-200 last:border-r-0">{val}</td>
                        ))}
                      </tr>
                      <tr className="hover:bg-red-50 transition-colors">
                        <td className="px-3 md:px-5 py-2 md:py-2">
                          <span className="text-xs md:text-sm font-semibold text-gray-700">損益分岐点稼働率(%)</span>
                        </td>
                        {formatResultValue('breakEvenOperatingRate', lastYearCalc, thisYearCalc, targetCalc).map((val, idx) => (
                          <td key={idx} className="px-3 md:px-5 py-2 md:py-2 text-right text-xs md:text-sm font-bold bg-white border-r border-gray-200 last:border-r-0">{val}</td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="border-l-4 border-main text-main rounded-lg p-4 shadow-sm">
                  <p className="text-xs md:text-sm text-gray-700 font-medium">
                    <span className="font-bold">※</span> 『加算込み損益』=『基本のみ損益』+『加算増収』
                  </p>
                </div>
              </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

