"use client";
import { useEffect, useState } from "react";
import { Addition } from "@/components/Addtion";
import { BasicRemuneration } from "@/components/BasicRemuneration";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useInitData, saveInitData } from "@/hooks/useServerData";
import { useAppContext } from "@/contexts/AppContext";
import { TreatmentBonusSelector } from "@/components/TreatmentBonusSelector";
import { InitData, SelectedService, SelectedServicesState, ServiceData } from "@/types/service";
import ServiceModal from "@/components/ServiceModal";

export default function Home() {
    // country level is read/written via initData.country_level
    const [totalBasicRemuneration, setTotalBasicRemuneration] = useState(0);
    const [totalAddition, setTotalAddition] = useState(0);
    const [total, setTotal] = useState(0);
    const { initData, setInitData, regDate, setRegDate } = useAppContext();
    const selectedServicesState: SelectedServicesState = initData.selected_services ?? {
        basic_remuneration: [],
        addition: [],
    };
    const [treatmentBonus, setTreatmentBonus] = useState<[number, number]>(
        initData.treatment_bonus ?? [0, 1]
    );
    const [modal, setModal] = useState<{ flag: boolean, id: string }>({ flag: false, id: "" });

    const { initData: fetchedInitData, isLoading: isLoadingInitData, error: fetchError } = useInitData(regDate);

    useEffect(() => {
        const nextBonus: [number, number] = initData.treatment_bonus ?? [0, 0];
        if (treatmentBonus[0] !== nextBonus[0] || treatmentBonus[1] !== nextBonus[1]) {
            setTreatmentBonus(nextBonus);
        }
    }, [initData.treatment_bonus, treatmentBonus]);

    const onSetCountryLevel = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        const numeric = isNaN(val) ? 0 : val;
        setInitData({ ...initData, country_level: numeric });
    };

    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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

    const onSetInitData = async () => {
        setIsSaving(true);
        setSaveMessage(null);

        const treatmentBonusTuple: [number, number] = [
            treatmentBonus[0] ?? 0,
            treatmentBonus[1] ?? 1,
        ];

        const dataToSave: InitData = {
            ...initData,
            reg_date: regDate,
            country_level: initData.country_level,
            treatment_bonus: treatmentBonusTuple,
        };

        const result = await saveInitData(dataToSave);

        if (result.success) {
            setSaveMessage({ type: 'success', text: '設定を保存しました' });
            setTimeout(() => setSaveMessage(null), 3000);
        } else {
            setSaveMessage({ type: 'error', text: result.error || '保存に失敗しました' });
        }

        setIsSaving(false);
    }

    const closeModal = () => {
        setModal({ flag: false, id: "" });
    };

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

    useEffect(() => {
        setTotal((totalBasicRemuneration + totalAddition) * (1 + treatmentBonus[1] / 100) * (initData.country_level || 1));
    }, [initData.country_level, totalBasicRemuneration, totalAddition, treatmentBonus]);

    useEffect(() => {
        // if (fetchedInitData) {
        //     console.log('Updating context with fetched data:', fetchedInitData);
        //     setInitData({
        //         ...fetchedInitData
        //     });
        // }
    }, [fetchedInitData]);

    return (
        <>
            <Header />
            {modal.flag && (
                <ServiceModal
                    modal={modal}
                    onClose={closeModal}
                    onSave={handleSaveModal}
                    selectedServices={selectedServicesState[modal.id] ?? []}
                />
            )}
            <main className="w-full bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-4 md:py-4 px-4 md:px-8 main-height min-h-screen">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Header Card */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                        <div className="bg-main px-4 md:px-8 py-4">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-white">基本報酬と加算設定</h1>
                                    <p className="text-blue-100 text-sm md:text-base">入力データを設定してください</p>
                                </div>
                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                    {/* <div className="flex items-center gap-3 w-full md:w-auto">
                                    <label className="text-sm md:text-base font-semibold text-white whitespace-nowrap">登録日:</label>
                                    <Input
                                        type="date"
                                        value={regDate}
                                        onChange={(e) => setRegDate(e.target.value)}
                                        className="flex-1 md:w-48 h-11 text-sm border-2 text-gray-800 border-blue-300 bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-300 rounded-lg"
                                    />
                                </div> */}
                                    <Button
                                        onClick={onSetInitData}
                                        disabled={isSaving}
                                        className='w-full md:w-36 h-11 bg-white color-main hover:bg-gray-100 font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                                    >
                                        {isSaving ? '保存中...' : '設  定'}
                                    </Button>
                                </div>
                            </div>

                        </div>
                        <div className="p-6 md:p-8">
                            {/* Status Messages */}
                            <div className="space-y-3 mb-6">
                                {isLoadingInitData && (
                                    <div className="px-4 py-3 rounded-lg text-sm bg-blue-100 text-blue-800 border-2 border-blue-300 shadow-sm">
                                        <span className="font-semibold">📥</span> データを読み込み中...
                                    </div>
                                )}
                                {fetchError && (
                                    <div className="px-4 py-3 rounded-lg text-sm bg-yellow-100 text-yellow-800 border-2 border-yellow-300 shadow-sm">
                                        <span className="font-semibold">⚠️</span> 警告: {fetchError}
                                    </div>
                                )}
                                {saveMessage && (
                                    <div className={`px-4 py-3 rounded-lg text-sm border-2 shadow-sm ${saveMessage.type === 'success'
                                        ? 'bg-green-100 text-green-800 border-green-300'
                                        : 'bg-red-100 text-red-800 border-red-300'
                                        }`}>
                                        <span className="font-semibold">{saveMessage.type === 'success' ? '✓' : '✗'}</span> {saveMessage.text}
                                    </div>
                                )}
                            </div>

                            {/* Content Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 mb-6">
                                <div className="flex flex-col gap-8 rounded-xl p-4 border-2 border-main shadow-md">
                                    <BasicRemuneration
                                        selectedServices={selectedServicesState.basic_remuneration ?? []}
                                        setTotal={setTotalBasicRemuneration}
                                        setModal={setModal}
                                        onQuantityChange={(serviceId, quantity) => handleQuantityChange('basic_remuneration', serviceId, quantity)}
                                        onRemoveService={(serviceId) => handleRemoveService('basic_remuneration', serviceId)}
                                    />
                                    <TreatmentBonusSelector value={treatmentBonus} onChange={handleTreatmentBonusChange} />
                                </div>
                                <div className="rounded-xl p-4 border-2 shadow-md border-main">
                                    <Addition
                                        selectedServices={selectedServicesState.addition ?? []}
                                        setTotal={setTotalAddition}
                                        setModal={setModal}
                                        onQuantityChange={(serviceId, quantity) => handleQuantityChange('addition', serviceId, quantity)}
                                        onRemoveService={(serviceId) => handleRemoveService('addition', serviceId)}
                                    />
                                </div>
                            </div>

                            {/* Country Level and Total */}
                            <div className="rounded-xl p-4 border-2 border-main text-main shadow-lg">
                                <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12">
                                    <div className="flex items-center gap-4">
                                        <label className="text-base md:text-lg font-bold text-gray-800 whitespace-nowrap">級地区分:</label>
                                        <Input
                                            type="number"
                                            value={initData.country_level}
                                            onChange={onSetCountryLevel}
                                            className="w-28 h-12 text-base font-bold text-center border-main bg-white focus:border-main rounded-lg"
                                        />
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-base md:text-lg font-bold text-gray-800">加算単価:</span>
                                        <span className="text-3xl md:text-4xl font-extrabold color-main bg-white px-6 py-3 rounded-lg border-2 border-main shadow-md">
                                            ¥{Math.round(total).toLocaleString('ja-JP')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
} 
