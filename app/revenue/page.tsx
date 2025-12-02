"use client";

import { Addition } from "@/components/Addtion";
import { BasicRemuneration } from "@/components/BasicRemuneration";
import Header from "@/components/Header";
import ServiceModal from "@/components/ServiceModal";
import { TreatmentBonusSelector } from "@/components/TreatmentBonusSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppContext } from "@/contexts/AppContext";
import { SelectedService, SelectedServicesState, ServiceData } from "@/types/service";
import { useEffect, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ExcelJS from "exceljs";
import { bonus_data } from "@/config/constants";

export default function Revenue() {
    // country level is read/written via initData.country_level
    const { initData, setInitData, regDate, setRegDate } = useAppContext();
    const [totalBasicRemuneration, setTotalBasicRemuneration] = useState(0);
    const [totalAddition, setTotalAddition] = useState(0);
    const selectedServicesState: SelectedServicesState = initData.selected_services ?? {
        basic_remuneration: [],
        addition: [],
    };
    const [modal, setModal] = useState<{ flag: boolean, id: string }>({ flag: false, id: "" });
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [fileName, setFileName] = useState("");
    const [treatmentBonus, setTreatmentBonus] = useState<[number, number]>(
        initData.treatment_bonus ?? [0, 1]
    );
    const [addVal, setAddVal] = useState<number>(0);

    const [val1, setVal1] = useState<number>(0);
    const [val2, setVal2] = useState<number>(0);
    const [val3, setVal3] = useState<{ str: string, num: number }[]>([]);
    const [val4, setVal4] = useState<number>(0);
    const [val5, setVal5] = useState<number>(0);
    const [val6, setVal6] = useState<{ str: string, num: number }[]>([]);

    const [tokyoVal, setTokyoVal] = useState<number>(0);

    const [val7, setVal7] = useState<{ str: string, num: number }>({ str: "", num: 0 });
    const [val8, setVal8] = useState<{ str: string, num: number }>({ str: "", num: 0 });
    const [val9, setVal9] = useState<number>(0);

    const [total, setTotal] = useState<number>(0);
    const [result, setResult] = useState<number>(0);

    const parsePrice = (value?: string) => {
        if (!value) {
            return 0;
        }
        const numericString = value.replace(/,/g, '').trim();
        const numeric = Number(numericString);
        return Number.isFinite(numeric) ? numeric : 0;
    };

    const handleSaveModal = (modalId: string, services: ServiceData[]) => {
        if (!modalId) {
            closeModal();
            return;
        }

        const previousList = selectedServicesState[modalId] ?? [];
        const nextList: SelectedService[] = services.map(service => {
            const unitPriceSource = service.price && service.price.trim().length > 0 ? service.price : service.default_price;
            const unitPrice = parsePrice(unitPriceSource);
            const existing = previousList.find(item => item.id === service.id);
            return {
                ...service,
                unitPrice,
                quantity: existing?.quantity ?? 1,
            };
        });

        setInitData({
            ...initData,
            selected_services: {
                ...selectedServicesState,
                [modalId]: nextList,
            },
        });

        closeModal();
    };

    const closeModal = () => {
        setModal({ flag: false, id: "" });
    };

    const handleRemoveService = (modalId: string, serviceId: number) => {
        const list = selectedServicesState[modalId] ?? [];
        const updatedList = list.filter(service => service.id !== serviceId);

        setInitData({
            ...initData,
            selected_services: {
                ...selectedServicesState,
                [modalId]: updatedList,
            },
        });
    };

    const handleQuantityChange = (modalId: string, serviceId: number, quantity: number) => {
        const list = selectedServicesState[modalId] ?? [];
        const updatedList = list.map(service => {
            if (service.id === serviceId) {
                return {
                    ...service,
                    quantity,
                };
            }
            return service;
        });

        setInitData({
            ...initData,
            selected_services: {
                ...selectedServicesState,
                [modalId]: updatedList,
            },
        });
    }

    const handleTreatmentBonusChange = (nextValues: number[]) => {
        const tuple: [number, number] = [
            nextValues[0] ?? 0,
            nextValues[1] ?? 1,
        ];
        setTreatmentBonus(tuple);
        setInitData({
            ...initData,
            reg_date: regDate,
            treatment_bonus: tuple,
        });
    };

    const onSetCountryLevel = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        const numeric = isNaN(val) ? 0 : val;
        setInitData({ ...initData, country_level: numeric });
    };

    const onSetVal1 = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        const numeric = isNaN(val) ? 0 : val;
        setVal1(numeric)
    };

    const onSetVal2 = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        const numeric = isNaN(val) ? 0 : val;
        setVal2(numeric)
    };

    const onSetVal3 = (e: React.ChangeEvent<HTMLInputElement>, index: number, key: boolean) => {
        let tempVal = [...val3];
        if (key)
            tempVal[index].str = e.target.value;
        else {
            const val = parseFloat(e.target.value);
            const numeric = isNaN(val) ? 0 : val;
            tempVal[index].num = numeric;
        }
        setVal3(tempVal);
    }

    const onAddVal3 = () => {
        let tempVal = [...val3, { str: "", num: 0 }];
        setVal3(tempVal);
    }

    const onDeleteVal3 = (index: number) => {
        const tempVal = val3.filter((val, key) => key !== index)
        setVal3(tempVal);
    }

    const onSetVal4 = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        const numeric = isNaN(val) ? 0 : val;
        setVal4(numeric)
    };

    const onSetVal5 = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        const numeric = isNaN(val) ? 0 : val;
        setVal5(numeric)
    };

    const onSetTokyoVal = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        const numeric = isNaN(val) ? 0 : val;
        setTokyoVal(numeric)
    };

    const onSetVal6 = (e: React.ChangeEvent<HTMLInputElement>, index: number, key: boolean) => {
        let tempVal = [...val6];
        if (key)
            tempVal[index].str = e.target.value;
        else {
            const val = parseFloat(e.target.value);
            const numeric = isNaN(val) ? 0 : val;
            tempVal[index].num = numeric;
        }
        setVal6(tempVal);
    }

    const onAddVal6 = () => {
        let tempVal = [...val6, { str: "", num: 0 }];
        setVal6(tempVal);
    }

    const onDeleteVal6 = (index: number) => {
        const tempVal = val6.filter((val, key) => key !== index)
        setVal6(tempVal);
    }

    const onSetVal7 = (e: React.ChangeEvent<HTMLInputElement>, key: boolean) => {
        let tempVal = { ...val7 };
        if (key)
            tempVal.str = e.target.value;
        else {
            const val = parseFloat(e.target.value);
            const numeric = isNaN(val) ? 0 : val;
            tempVal.num = numeric;
        }
        setVal7(tempVal);
    }

    const onSetVal8 = (e: React.ChangeEvent<HTMLInputElement>, key: boolean) => {
        let tempVal = { ...val8 };
        if (key)
            tempVal.str = e.target.value;
        else {
            const val = parseFloat(e.target.value);
            const numeric = isNaN(val) ? 0 : val;
            tempVal.num = numeric;
        }
        setVal8(tempVal);
    }

    const onSetVal9 = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        const numeric = isNaN(val) ? 0 : val;
        setVal9(numeric)
    };

    const handleSaveClick = () => {
        if (!total || !result) {
            return;
        }

        // デフォルトファイル名を設定
        const now = new Date();
        const dateStr = now.toISOString().slice(0, 19).replace(/[:-]/g, "").replace("T", "_");
        setFileName(`${dateStr}`);
        setShowSaveModal(true);
    };

    const onSaveLocalStorage = () => {
        const STORAGE_KEY = "revenue_data"
    }

    const handleSaveConfirm = () => {
        if (fileName.trim()) {
            handleSaveExcelData(fileName.trim());
        } else {
            handleSaveExcelData();
        }
        onSaveLocalStorage();
    };

    const handleSaveExcelData = async (customFileName?: string) => {
        if (!total || !result) {
            return;
        }

        // ExcelJSワークブックを作成
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("収入合計と人件費率比較");

        // 列幅の設定
        worksheet.getColumn('A').width = 10;
        worksheet.getColumn('B').width = 14;
        worksheet.getColumn('C').width = 20;
        worksheet.getColumn('D').width = 14;
        worksheet.getColumn('E').width = 10;
        worksheet.getColumn('F').width = 11;
        worksheet.getColumn('G').width = 24;
        worksheet.getColumn('H').width = 10;
        worksheet.getColumn('I').width = 20;
        worksheet.getColumn('J').width = 16;

        // スタイル定義
        const yellowFill = {
            type: 'pattern' as const,
            pattern: 'solid' as const,
            fgColor: { argb: 'FFECB3' } // 黄色
        };

        const blueFill = {
            type: 'pattern' as const,
            pattern: 'solid' as const,
            fgColor: { argb: 'B3ECFF' } // 黄色
        };

        const borderStyle = {
            top: { style: 'thin' as const },
            bottom: { style: 'thin' as const },
            left: { style: 'thin' as const },
            right: { style: 'thin' as const }
        };
        // C1: タイトル
        const titleCell = worksheet.getCell('C1');
        titleCell.value = 'タイトル　収入合計と人件費率比較';
        titleCell.font = { bold: true, size: 12 };
        worksheet.mergeCells('C1:F1');

        worksheet.getCell('A3').value = "【収入】"
        worksheet.getCell('I3').value = "【人件費率】"
        worksheet.getCell('A4').value = "（1）介護保険収益"
        worksheet.getCell(`C4`).border = borderStyle;
        worksheet.getCell(`D4`).border = borderStyle;
        worksheet.getCell(`E4`).border = borderStyle;
        worksheet.getCell(`F4`).value = val1;
        worksheet.getCell(`F4`).fill = blueFill;
        worksheet.getCell(`F4`).border = borderStyle;

        worksheet.getCell('A6').value = "（2）児童福祉事業収益"
        worksheet.getCell(`C6`).border = borderStyle;
        worksheet.getCell(`D6`).border = borderStyle;
        worksheet.getCell(`E6`).border = borderStyle;
        worksheet.getCell(`F6`).value = val2;
        worksheet.getCell(`F6`).fill = blueFill;
        worksheet.getCell(`F6`).border = borderStyle;

        worksheet.getCell('A8').value = "（3）障害福祉サービス等事業収益"

        worksheet.getCell('B9').value = "① 自立支援給付費収益"
        worksheet.getCell('C10').value = "【基本報酬】"
        worksheet.getCell('D10').value = "単位数"
        worksheet.getCell('E10').value = "回数"
        worksheet.getCell('F10').value = "小計"

        let row = 11;
        selectedServicesState.basic_remuneration.forEach((val) => {
            worksheet.getCell(`C${row}`).value = val.short_content;
            worksheet.getCell(`C${row}`).border = borderStyle;
            worksheet.getCell(`D${row}`).value = val.unitPrice;
            worksheet.getCell(`D${row}`).border = borderStyle;
            worksheet.getCell(`E${row}`).value = val.quantity;
            worksheet.getCell(`E${row}`).border = borderStyle;
            worksheet.getCell(`F${row}`).value = val.unitPrice * val.quantity;
            worksheet.getCell(`F${row}`).border = borderStyle;
            row++;
        })
        worksheet.getCell(`F${row}`).value = totalBasicRemuneration;
        worksheet.getCell(`F${row}`).border = borderStyle;

        // 【加算】
        row += 1;
        worksheet.getCell(`C${row}`).value = "【加算】";
        row += 1;
        selectedServicesState.addition.forEach((val, index) => {
            worksheet.getCell(`C${row}`).value = val.short_content;
            worksheet.getCell(`C${row}`).border = borderStyle;
            worksheet.getCell(`D${row}`).value = val.unitPrice;
            worksheet.getCell(`D${row}`).border = borderStyle;
            worksheet.getCell(`E${row}`).value = val.quantity;
            worksheet.getCell(`E${row}`).border = borderStyle;
            worksheet.getCell(`F${row}`).value = val.unitPrice * val.quantity;
            worksheet.getCell(`F${row}`).border = borderStyle;
            row ++;
        })
        worksheet.getCell(`F${row}`).value = totalAddition;
        worksheet.getCell(`F${row}`).border = borderStyle;

        row += 1;
        worksheet.getCell(`C${row}`).value = "年間総単位数";
        worksheet.getCell(`C${row}`).border = borderStyle;
        worksheet.getCell(`D${row}`).border = borderStyle;
        worksheet.getCell(`E${row}`).border = borderStyle;
        worksheet.getCell(`F${row}`).value = totalBasicRemuneration + totalBasicRemuneration;
        worksheet.getCell(`F${row}`).border = borderStyle;
        row += 1;
        worksheet.getCell(`C${row}`).value = "処遇改善加算";
        worksheet.getCell(`C${row}`).border = borderStyle;
        worksheet.getCell(`D${row}`).value = bonus_data[treatmentBonus[0]][0];
        worksheet.getCell(`D${row}`).border = borderStyle;
        worksheet.getCell(`E${row}`).border = borderStyle;
        worksheet.getCell(`F${row}`).value = treatmentBonus[1];
        worksheet.getCell(`F${row}`).border = borderStyle;
        row += 1;
        worksheet.getCell(`C${row}`).value = "総合計";
        worksheet.getCell(`C${row}`).border = borderStyle;
        worksheet.getCell(`D${row}`).value = initData.country_level;
        worksheet.getCell(`D${row}`).border = borderStyle;
        worksheet.getCell(`E${row}`).border = borderStyle;
        worksheet.getCell(`F${row}`).value = addVal;
        worksheet.getCell(`F${row}`).border = borderStyle;
        row += 1;
        worksheet.getCell(`B${row}`).value = "② 利用者負担金収益";
        row += 1;
        val3.forEach((val) => {
            worksheet.getCell(`C${row}`).value = val.str;
            worksheet.getCell(`C${row}`).fill = yellowFill;
            worksheet.getCell(`C${row}`).border = borderStyle;
            worksheet.getCell(`D${row}`).value = initData.country_level;
            worksheet.getCell(`D${row}`).border = borderStyle;
            worksheet.getCell(`E${row}`).border = borderStyle;
            worksheet.getCell(`F${row}`).value = addVal;
            worksheet.getCell(`F${row}`).fill = blueFill;
            worksheet.getCell(`F${row}`).border = borderStyle;
            row++;
        })
        worksheet.getCell(`B${row}`).value = "③ 補足給付費収益";
        row += 1;
        worksheet.getCell(`C${row}`).border = borderStyle;
        worksheet.getCell(`D${row}`).border = borderStyle;
        worksheet.getCell(`E${row}`).border = borderStyle;
        worksheet.getCell(`F${row}`).value = val4;
        worksheet.getCell(`F${row}`).fill = blueFill;
        worksheet.getCell(`F${row}`).border = borderStyle;
        row += 1;
        worksheet.getCell(`B${row}`).value = "④ 特定費用収益";
        row += 1;
        worksheet.getCell(`C${row}`).border = borderStyle;
        worksheet.getCell(`D${row}`).border = borderStyle;
        worksheet.getCell(`E${row}`).border = borderStyle;
        worksheet.getCell(`F${row}`).value = val5;
        worksheet.getCell(`F${row}`).fill = blueFill;
        worksheet.getCell(`F${row}`).border = borderStyle;

        row += 1;
        worksheet.getCell(`B${row}`).value = "⑤ その他の事業収益⇒補助金・委託費・指定管理料を計上";
        row += 1;
        worksheet.mergeCells(`C${row}:E${row}`);
        worksheet.getCell(`C${row}`).value = "東京都ｻｰﾋﾞｽ推進費";
        worksheet.getCell(`C${row}`).border = borderStyle;
        worksheet.getCell(`F${row}`).value = tokyoVal;
        worksheet.getCell(`F${row}`).fill = blueFill;
        worksheet.getCell(`F${row}`).border = borderStyle;
        row += 1;
        val6.forEach((val: { str: string, num: number }) => {
            worksheet.mergeCells(`C${row}:E${row}`);
            worksheet.getCell(`C${row}`).value = val.str;
            worksheet.getCell(`C${row}`).fill = yellowFill;
            worksheet.getCell(`C${row}`).border = borderStyle;
            worksheet.getCell(`F${row}`).value = val.num;
            worksheet.getCell(`F${row}`).fill = blueFill;
            worksheet.getCell(`F${row}`).border = borderStyle;
            row++;
        })

        worksheet.getCell(`A${row}`).value = "（4）経常経費寄付金収益";
        worksheet.mergeCells(`C${row}:E${row}`);
        worksheet.getCell(`C${row}`).value = val7.str;
        worksheet.getCell(`C${row}`).fill = yellowFill;
        worksheet.getCell(`C${row}`).border = borderStyle;
        worksheet.getCell(`F${row}`).value = val7.num;
        worksheet.getCell(`F${row}`).fill = blueFill;
        worksheet.getCell(`F${row}`).border = borderStyle;
        row += 2;
        worksheet.getCell(`A${row}`).value = "（5）その他の収益";
        worksheet.mergeCells(`C${row}:E${row}`);
        worksheet.getCell(`C${row}`).value = val8.str;
        worksheet.getCell(`C${row}`).fill = yellowFill;
        worksheet.getCell(`C${row}`).border = borderStyle;
        worksheet.getCell(`F${row}`).value = val8.num;
        worksheet.getCell(`F${row}`).fill = blueFill;
        worksheet.getCell(`F${row}`).border = borderStyle;

        row += 2;
        worksheet.getCell(`C${row}`).value = "収入合計";
        worksheet.getCell(`C${row}`).border = { bottom: { style: 'thin' as const }, };
        worksheet.getCell(`D${row}`).border = { bottom: { style: 'thin' as const }, };
        worksheet.getCell(`E${row}`).border = { bottom: { style: 'thin' as const }, };
        worksheet.getCell(`F${row}`).value = total;
        worksheet.getCell(`F${row}`).border = { bottom: { style: 'thin' as const }, };

        //人件費
        worksheet.getCell("I6").value = "人件費";
        worksheet.getCell("I6").border = borderStyle;
        worksheet.getCell("J6").value = val9;
        worksheet.getCell("J6").fill = blueFill;
        worksheet.getCell("J6").border = borderStyle;
        //サービス活動収益計
        worksheet.getCell("I7").value = "サービス活動収益計";
        worksheet.getCell("I7").border = borderStyle;
        worksheet.getCell("J7").value = total;
        worksheet.getCell("J7").border = borderStyle;
        worksheet.getCell("I8").border = borderStyle;
        worksheet.getCell("J8").value = result;
        worksheet.getCell("J8").border = borderStyle;

        const finalFileName = customFileName
            ? (customFileName.endsWith('.xlsx') ? customFileName : `${customFileName}.xlsx`)
            : (() => {
                const now = new Date();
                const dateStr = now.toISOString().slice(0, 19).replace(/[:-]/g, "").replace("T", "_");
                return `${dateStr}.xlsx`;
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
    }

    useEffect(() => {
        const tempVal = (totalBasicRemuneration + totalAddition) + ((totalBasicRemuneration + totalAddition) * treatmentBonus[1]) * initData.country_level;
        setAddVal(Number(tempVal.toFixed(3)));
    }, [initData, totalAddition, totalBasicRemuneration, treatmentBonus]);

    useEffect(() => {
        let sum = 0;
        val3.forEach(val => sum += val.num);
        val6.forEach(val => sum += val.num);

        let tempVal = val1 + val2 + addVal + val4 + val5 + val7.num + val8.num + sum;
        setTotal(tempVal)
        sum = Number((val9 / tempVal * 100).toFixed(3));
        setResult(sum ? sum : 0);
    }, [val1, val2, val3, val4, val5, val6, val7, val8, val9, addVal])

    return (
        <div className='w-full h-screen flex flex-col justify-center'>
            <Header />
            {modal.flag && (
                <ServiceModal
                    modal={modal}
                    onClose={closeModal}
                    onSave={handleSaveModal}
                    selectedServices={selectedServicesState[modal.id] ?? []}
                />
            )}
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
                                placeholder="比較データ_20250101_120000"
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
            <div className='w-full flex justify-center text-center px-8 pt-4 pb-1'>
                <div className='w-full flex justify-between text-center max-w-[1440px]'>
                    <h1 className='w-full text-left font-bold text-gray-800 text-2xl md:text-3xl'>収入合計と人件費率</h1>
                    <Button
                        onClick={handleSaveClick}
                        className="max-w-[100px] bg-main hover:bg-blue-500 text-white"
                    >
                        保&nbsp;&nbsp;&nbsp;存
                    </Button>
                </div>
            </div>

            <div className="flex-auto w-full flex justify-center overflow-hidden px-4">
                <div className="w-full max-w-[1440px] rounded-xl border-2 border-main text-main shadow-lg mb-4 overflow-hidden">
                    <div className="h-full overflow-hidden">
                        <div className='w-full h-full flex flex-col md:flex-row gap-4'>
                            <PerfectScrollbar className="w-full h-full px-4">
                                <div className='w-full flex flex-col md:flex-row gap-2 md:gap-2'>
                                    <div className="w-full flex gap-4 py-4 items-center">
                                        <h2 className="text-base md:text-lg font-bold text-gray-800 whitespace-nowrap">（1）介護保険収益:</h2>
                                        <Input
                                            type="number"
                                            value={val1}
                                            onChange={onSetVal1}
                                            className="w-full text-base font-bold text-right border-main bg-white focus:border-main rounded-lg border-gray-300 focus:border-blue-300 focus:ring-1 focus:ring-blue-300"
                                        />
                                    </div>
                                    <div className="w-full flex gap-4 py-4 items-center">
                                        <h2 className="text-base md:text-lg font-bold text-gray-800 whitespace-nowrap">（2）児童福祉事業収益:</h2>
                                        <Input
                                            type="number"
                                            value={val2}
                                            onChange={onSetVal2}
                                            className="w-full text-base font-bold text-right border-main bg-white focus:border-main rounded-lg border-gray-300 focus:border-blue-300 focus:ring-1 focus:ring-blue-300"
                                        />
                                    </div>
                                </div>
                                <div className="w-full pt-4">
                                    <h2 className="text-base md:text-lg font-bold text-gray-800 whitespace-nowrap pb-2">（3）障害福祉サービス等事業収益:</h2>
                                    <div className='w-full border-2 border-main rounded-lg p-2'>
                                        <h3 className="text-base md:text-lg font-bold color-main whitespace-nowrap">① 自立支援給付費収益:</h3>
                                        <div className='w-full h-full flex flex-col lg:flex-row gap-4'>
                                            <BasicRemuneration
                                                selectedServices={selectedServicesState.basic_remuneration ?? []}
                                                setTotal={setTotalBasicRemuneration}
                                                setModal={setModal}
                                                onQuantityChange={(serviceId, quantity) => handleQuantityChange('basic_remuneration', serviceId, quantity)}
                                                onRemoveService={(serviceId) => handleRemoveService('basic_remuneration', serviceId)}
                                            />
                                            <Addition
                                                selectedServices={selectedServicesState.addition ?? []}
                                                setTotal={setTotalAddition}
                                                setModal={setModal}
                                                onQuantityChange={(serviceId, quantity) => handleQuantityChange('addition', serviceId, quantity)}
                                                onRemoveService={(serviceId) => handleRemoveService('addition', serviceId)}
                                            />
                                        </div>
                                        <div className='w-full flex flex-col lg:flex-row'>
                                            <TreatmentBonusSelector value={treatmentBonus} onChange={handleTreatmentBonusChange} />
                                            <div className='w-full flex flex-col md:flex-row gap-4'>
                                                <div className="w-full flex gap-2 py-4 items-center">
                                                    <h2 className="text-base md:text-lg font-bold text-gray-800 whitespace-nowrap">年間総単位数:</h2>
                                                    <Input
                                                        type="number"
                                                        readOnly
                                                        value={totalBasicRemuneration + totalAddition}
                                                        className="w-full max-w-[200px] text-2xl color-main font-bold text-right border-main bg-white focus:border-main rounded-lg border-gray-300 focus:border-blue-300 focus:ring-1 focus:ring-blue-300"
                                                    />
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <label className="text-base md:text-lg font-bold text-gray-800 whitespace-nowrap">級地区分:</label>
                                                    <Input
                                                        type="number"
                                                        value={initData.country_level}
                                                        onChange={onSetCountryLevel}
                                                        className="w-full text-2xl color-main font-bold text-right border-main bg-white focus:border-main rounded-lg border-gray-300 focus:border-blue-300 focus:ring-1 focus:ring-blue-300"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full flex gap-2 py-4 items-center justify-end">
                                            <h2 className="text-base md:text-lg font-bold text-gray-800 whitespace-nowrap">総合計:</h2>
                                            <Input
                                                type="number"
                                                readOnly
                                                value={addVal}
                                                className="w-full max-w-[240px] text-3xl color-main font-bold text-right border-main bg-white focus:border-main rounded-lg border-gray-300 focus:border-blue-300 focus:ring-1 focus:ring-blue-300"
                                            />
                                        </div>
                                        <div className='w-full flex gap-4 flex-col md:flex-row pt-4'>
                                            <div className='w-full'>
                                                <div className='w-full'>
                                                    <div className='w-full flex justify-between items-center pb-1'>
                                                        <h3 className="text-base md:text-lg font-bold color-main">② 利用者負担金収益:</h3>
                                                        <Button className='py-0' onClick={onAddVal3}>追加</Button>
                                                    </div>
                                                    {val3.length ?
                                                        (<div className='w-full border-2 border-main border-dotted rounded-lg'>
                                                            {val3.map((val: { str: string, num: number }, index: number) => {
                                                                return (
                                                                    <div key={`val3_${index}`} className='full flex gap-1 p-2'>
                                                                        <Input
                                                                            type="text"
                                                                            value={val.str}
                                                                            onChange={e => onSetVal3(e, index, true)}
                                                                            className="w-full text-base font-bold border-main bg-white focus:border-main rounded-lg border-gray-300 focus:border-blue-300 focus:ring-1 focus:ring-blue-300"
                                                                        />
                                                                        <Input
                                                                            type="number"
                                                                            value={val.num}
                                                                            onChange={e => onSetVal3(e, index, false)}
                                                                            className="w-full max-w-[160] text-base font-bold text-right border-main bg-white focus:border-main rounded-lg border-gray-300 focus:border-blue-300 focus:ring-1 focus:ring-blue-300"
                                                                        />
                                                                        <Button className='text-red-400 bg-transparent hover:text-red-500'
                                                                            onClick={() => onDeleteVal3(index)}
                                                                        >削除</Button>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>)
                                                        : <></>
                                                    }
                                                </div>
                                                <div className='w-full flex gap-4 items-center pt-4'>
                                                    <h3 className="text-base md:text-lg font-bold color-main whitespace-nowrap">③ 補足給付費収益:</h3>
                                                    <Input
                                                        type="number"
                                                        value={val4}
                                                        onChange={onSetVal4}
                                                        className="w-full text-md font-bold text-right border-main bg-white focus:border-main rounded-lg border-gray-300 focus:border-blue-300 focus:ring-1 focus:ring-blue-300"
                                                    />
                                                </div>
                                                <div className='w-full flex gap-4 items-center pt-4'>
                                                    <h3 className="text-base md:text-lg font-bold color-main whitespace-nowrap">④ 特定費用収益:</h3>
                                                    <Input
                                                        type="number"
                                                        value={val5}
                                                        onChange={onSetVal5}
                                                        className="w-full text-md font-bold text-right border-main bg-white focus:border-main rounded-lg border-gray-300 focus:border-blue-300 focus:ring-1 focus:ring-blue-300"
                                                    />
                                                </div>
                                            </div>

                                            <div className='w-full'>
                                                <div className='flex justify-between items-center pb-1'>
                                                    <h3 className="text-base md:text-lg font-bold color-main">⑤ その他の事業収益⇒補助金・委託費・指定管理料を計上:</h3>
                                                    <Button className='py-0' onClick={onAddVal6}>追加</Button>
                                                </div>
                                                <div className='w-full pl-8'>
                                                    <div className='w-full border-2 border-main border-dotted rounded-lg'>
                                                        <div className='full flex gap-1 p-2'>
                                                            <Input
                                                                type="text"
                                                                readOnly
                                                                value={"東京都ｻｰﾋﾞｽ推進費"}
                                                                className="w-full text-base font-bold border-main bg-white focus:border-main rounded-lg border-gray-300 focus:border-blue-300 focus:ring-1 focus:ring-blue-300"
                                                            />
                                                            <Input
                                                                type="number"
                                                                value={tokyoVal}
                                                                onChange={onSetTokyoVal}
                                                                className="w-full max-w-[160] text-base font-bold text-right border-main bg-white focus:border-main rounded-lg border-gray-300 focus:border-blue-300 focus:ring-1 focus:ring-blue-300"
                                                            />
                                                        </div>
                                                        {val6.map((val: { str: string, num: number }, index: number) => {
                                                            return (
                                                                <div key={`val3_${index}`} className='full flex gap-1 p-2'>
                                                                    <Input
                                                                        type="text"
                                                                        value={val.str}
                                                                        onChange={e => onSetVal6(e, index, true)}
                                                                        className="w-full text-base font-bold border-main bg-white focus:border-main rounded-lg border-gray-300 focus:border-blue-300 focus:ring-1 focus:ring-blue-300"
                                                                    />
                                                                    <Input
                                                                        type="number"
                                                                        value={val.num}
                                                                        onChange={e => onSetVal6(e, index, false)}
                                                                        className="w-full max-w-[160] text-base font-bold text-right border-main bg-white focus:border-main rounded-lg border-gray-300 focus:border-blue-300 focus:ring-1 focus:ring-blue-300"
                                                                    />
                                                                    <Button className='text-red-400 bg-transparent hover:text-red-500'
                                                                        onClick={() => onDeleteVal6(index)}
                                                                    >削除</Button>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='w-full flex flex-col lg:flex-row md:gap-2'>
                                    <div className="w-full flex flex-col md:flex-row items-start md:items-center gap-4 py-4">
                                        <h2 className="text-base md:text-lg font-bold text-gray-800 whitespace-nowrap">（4）経常経費寄付金収益:</h2>
                                        <div className='w-full flex gap-2'>
                                            <Input
                                                type="text"
                                                value={val7.str}
                                                onChange={e => onSetVal7(e, true)}
                                                className="w-full text-base font-bold border-main bg-white focus:border-main rounded-lg border-gray-300 focus:border-blue-300 focus:ring-1 focus:ring-blue-300"
                                            />
                                            <Input
                                                type="number"
                                                value={val7.num}
                                                onChange={e => onSetVal7(e, false)}
                                                className="w-full max-w-[160] text-base font-bold text-right border-main bg-white focus:border-main rounded-lg border-gray-300 focus:border-blue-300 focus:ring-1 focus:ring-blue-300"
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full flex flex-col md:flex-row items-start md:items-center gap-4 py-4">
                                        <h2 className="text-base md:text-lg font-bold text-gray-800 whitespace-nowrap">（5）その他の収益:</h2>
                                        <div className='w-full flex gap-2'>
                                            <Input
                                                type="text"
                                                value={val8.str}
                                                onChange={e => onSetVal8(e, true)}
                                                className="w-full text-base font-bold border-main bg-white focus:border-main rounded-lg border-gray-300 focus:border-blue-300 focus:ring-1 focus:ring-blue-300"
                                            />
                                            <Input
                                                type="number"
                                                value={val8.num}
                                                onChange={e => onSetVal8(e, false)}
                                                className="w-full max-w-[160] text-base font-bold text-right border-main bg-white focus:border-main rounded-lg border-gray-300 focus:border-blue-300 focus:ring-1 focus:ring-blue-300"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </PerfectScrollbar>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full flex justify-center px-4">
                <div className="w-full max-w-[1440px] flex flex-col lg:flex-row justify-center items-center gap-6 rounded-xl p-4 border-2 border-main text-main shadow-lg mb-4">
                    <div className="w-full flex flex-col sm:flex-row items-start md:items-center gap-4">
                        <label className="text-base md:text-lg font-bold text-gray-800 whitespace-nowrap">人件費:</label>
                        <Input
                            type="number"
                            value={val9}
                            onChange={onSetVal9}
                            className="md:min-w-[200px] h-12 text-base font-bold text-right border-main bg-white focus:border-main rounded-lg border-gray-300 focus:border-blue-300 focus:ring-1 focus:ring-blue-300"
                        />
                    </div>
                    <div className="w-full flex flex-col sm:flex-row justify-start items-start md:items-center gap-4">
                        <span className="text-base md:text-lg font-bold text-gray-800 whitespace-nowrap">サービス活動収益計:</span>
                        <span className="w-full text-2 md:text-3xl text-right md:min-w-[200px] font-extrabold color-main bg-white px-6 py-3 rounded-lg border-2 border-main shadow-md">
                            {total}
                        </span>
                    </div>
                    <span className="w-full text-2 md:text-4xl text-right md:min-w-[200px] font-extrabold color-main bg-white px-6 py-3 rounded-lg border-2 border-main shadow-md">
                        {result}%
                    </span>
                </div>
            </div>
        </div>
    );
} 
