"use client";

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SERVER_URL } from "@/config";
import { ServiceData } from "@/types/service";
import axios from "axios";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";

export default function EditService() {
    const [service, setService] = useState<ServiceData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const { user } = useAuthContext();
    const [tblName, setTblName] = useState<string | null>(null);
    useEffect(() => {
        if (!user) {
            router.push("/login");
        } else if (user.role !== "admin") {
            router.push("/home");
        }
        const fetchService = async () => {
            try {
                const response = await axios.get<{ service: ServiceData, tbl_name: string }>(`${SERVER_URL}/code/${id}`);
                setService(response.data.service);
                setTblName(response.data.tbl_name);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setError("サービスデータの取得に失敗しました");
            } finally {
                setIsLoading(false);
            }
        };
        fetchService();
    }, [id, user]);

    const handleInputChange = (field: keyof ServiceData, value: string | number | null) => {
        if (!service) return;
        setService({
            ...service,
            [field]: value,
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!service || !confirm("このサービスを更新しますか？この操作はキャンセルできません。")) return;

        setIsSaving(true);
        setError(null);
        setSuccessMessage(null);

        try {
            await axios.put(`${SERVER_URL}/code/${id}`, { service: service, tbl_name: tblName });
            setSuccessMessage("サービスを更新しました");
            setTimeout(() => {
                router.push("/service");
            }, 1500);
        } catch (error) {
            console.error(error);
            setError("更新に失敗しました");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!service || !confirm("このサービスを削除しますか？この操作は取り消せません。")) return;

        setIsSaving(true);
        setError(null);

        try {
            await axios.delete(`${SERVER_URL}/code/${id}`, { data: { tbl_name: tblName } });
            setSuccessMessage("サービスを削除しました");
            setTimeout(() => {
                router.push("/service");
            }, 1500);
        } catch (error) {
            console.error(error);
            setError("削除に失敗しました");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <>
                <Header />
                <main className="w-full bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-6 md:py-10 px-4 md:px-8 min-h-screen">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                            <div className="text-center text-lg text-gray-500">読み込み中...</div>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    if (!service) {
        return (
            <>
                <Header />
                <main className="w-full bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-6 md:py-10 px-4 md:px-8 min-h-screen">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                            <div className="text-center text-lg text-red-500">サービスが見つかりません</div>
                            <div className="mt-4 text-center">
                                <Link href="/service">
                                    <Button variant="outline">サービス一覧に戻る</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="w-full bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-6 md:py-10 px-4 md:px-8 min-h-screen">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Header Card */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                        <div className="bg-main px-6 md:px-8 py-6">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">サービス編集</h1>
                                    <p className="text-blue-100 text-sm md:text-base">サービス情報を編集、アーカイブ、または削除できます</p>
                                </div>
                                <Link href="/service">
                                    <Button variant="outline" className="bg-white text-gray-800 hover:bg-gray-100">
                                        一覧に戻る
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Messages */}
                        {(error || successMessage) && (
                            <div className="px-6 md:px-8 pt-4">
                                {error && (
                                    <div className="px-4 py-3 rounded-lg text-sm bg-red-100 text-red-800 border-2 border-red-300 shadow-sm">
                                        <span className="font-semibold">✗</span> {error}
                                    </div>
                                )}
                                {successMessage && (
                                    <div className="px-4 py-3 rounded-lg text-sm bg-green-100 text-green-800 border-2 border-green-300 shadow-sm">
                                        <span className="font-semibold">✓</span> {successMessage}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                            <div className="flex flex-col gap-4">
                                {/* Basic Information */}
                                <h2 className="text-lg font-semibold text-gray-800 border-b">サービスコード</h2>
                                <div className="flex gap-2 md:flex-row flex-col">
                                    <div className="w-full flex flex-col gap-2">
                                        <label className="block text-sm font-medium text-gray-700">種類</label>
                                        <Input
                                            value={service.service_kind || ""}
                                            onChange={(e) => handleInputChange("service_kind", e.target.value)}
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="w-full flex flex-col gap-2">
                                        <label className="block text-sm font-medium text-gray-700">項目</label>
                                        <Input
                                            value={service.service_id || ""}
                                            onChange={(e) => handleInputChange("service_id", e.target.value)}
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4">
                                <h2 className="text-lg font-semibold text-gray-800 border-b">サービス内容</h2>
                                <div className="flex gap-2 md:flex-row flex-col">
                                    <div className="w-full flex flex-col gap-2">
                                        <label className="block text-sm font-medium text-gray-700">サービス略称</label>
                                        <Input
                                            value={service.short_content || ""}
                                            onChange={(e) => handleInputChange("short_content", e.target.value)}
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="w-full flex flex-col gap-2">
                                        <label className="block text-sm font-medium text-gray-700">サービス名</label>
                                        <Input
                                            value={service.service_name || ""}
                                            onChange={(e) => handleInputChange("service_name", e.target.value)}
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4">
                                <h2 className="text-lg font-semibold text-gray-800 border-b">算定項目</h2>
                                <div className="w-full flex gap-2 md:flex-row flex-col">
                                    <div className="w-full flex flex-col gap-2">
                                        <label className="block text-sm font-medium text-gray-700">定員数</label>
                                        <Input
                                            value={service.member_num || ""}
                                            onChange={(e) => handleInputChange("member_num", e.target.value)}
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="w-full flex flex-col gap-2">
                                        <label className="text-sm font-medium text-gray-700">区分</label>
                                        <Input
                                            value={service.category || ""}
                                            onChange={(e) => handleInputChange("category", e.target.value)}
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="w-full flex flex-col gap-2">
                                        <label className="text-sm font-medium text-gray-700">勤務時間</label>
                                        <Input
                                            value={service.work_time || ""}
                                            onChange={(e) => handleInputChange("work_time", e.target.value)}
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                                <div className="w-full flex gap-2 md:flex-row flex-col">
                                    <div className="w-full flex flex-col gap-2">
                                        <label className="text-sm font-medium text-gray-700">基準価格</label>
                                        <Input
                                            value={service.default_price || ""}
                                            onChange={(e) => handleInputChange("default_price", e.target.value)}
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="w-full flex flex-col gap-2">
                                        <label className="block text-sm font-medium text-gray-700">価格</label>
                                        <Input
                                            value={service.price || ""}
                                            onChange={(e) => handleInputChange("price", e.target.value)}
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="w-full flex flex-col gap-2">
                                        <label className="block text-sm font-medium text-gray-700">算定単位</label>
                                        <Input
                                            value={service.unit || ""}
                                            onChange={(e) => handleInputChange("unit", e.target.value)}
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                                <div className="w-full flex gap-2 items-center md:flex-row flex-col">
                                    <label className="w-full text-sm font-medium text-gray-700">地方公共団体が設置する指定生活介護事業所又は指定障害者支援施設の場合</label>
                                    <Input
                                        value={service.country_percent || ""}
                                        onChange={(e) => handleInputChange("country_percent", e.target.value ? parseFloat(e.target.value) : null)}
                                        className="w-full md:w-1/4"
                                    />
                                </div>
                                <div className="w-full flex flex-col gap-2 items-center">
                                    <label className="w-full text-sm font-medium text-gray-700">生活介護計画が作成されない場合</label>
                                    <div className="w-full flex gap-2">
                                        <Input
                                            value={service.no_plan_term || ""}
                                            onChange={(e) => handleInputChange("no_plan_term", e.target.value ? parseFloat(e.target.value) : null)}
                                            className="w-full"
                                        />
                                        <Input
                                            value={service.no_plan_percent || ""}
                                            onChange={(e) => handleInputChange("no_plan_percent", e.target.value ? parseFloat(e.target.value) : null)}
                                            className="w-1/4"
                                        />
                                    </div>
                                </div>
                                <div className="w-full flex gap-2 md:flex-row flex-col">
                                    <div className="w-full flex flex-col gap-2">
                                        <label className="block text-sm font-medium text-gray-700">減額タイプ</label>
                                        <Input
                                            value={service.reduce_type || ""}
                                            onChange={(e) => handleInputChange("reduce_type", e.target.value)}
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="w-full flex flex-col gap-2">
                                        <label className="block text-sm font-medium text-gray-700">減額条件</label>
                                        <Input
                                            value={service.reduce_condition || ""}
                                            onChange={(e) => handleInputChange("reduce_condition", e.target.value)}
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="w-full flex flex-col gap-2">
                                        <label className="block text-sm font-medium text-gray-700">減額率</label>
                                        <Input
                                            type="number"
                                            value={service.reduce_percent ?? ""}
                                            onChange={(e) => handleInputChange("reduce_percent", e.target.value ? parseFloat(e.target.value) : null)}
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                                <div className="w-full flex gap-2 items-center md:flex-row flex-col">
                                    <div className="w-full flex gap-2 items-center md:flex-row flex-col">
                                        <label className="block whitespace-nowrap text-sm font-medium text-gray-700">定員以上</label>
                                        <Input
                                            value={service.big_company || ""}
                                            onChange={(e) => handleInputChange("big_company", e.target.value)}
                                            className="w-full"
                                        />
                                        <Input
                                            type="number"
                                            value={service.big_company_percent ?? ""}
                                            onChange={(e) => handleInputChange("big_company_percent", e.target.value ? parseFloat(e.target.value) : null)}
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                                <div className="w-full flex gap-2 items-center md:flex-row flex-col">
                                    <div className="w-full flex gap-2 items-center md:flex-row flex-col">
                                        <label className="block whitespace-nowrap text-sm font-medium text-gray-700">定員以下</label>
                                        <Input
                                            value={service.small_company || ""}
                                            onChange={(e) => handleInputChange("small_company", e.target.value)}
                                            className="w-full"
                                        />
                                        <Input
                                            type="number"
                                            value={service.small_company_percent ?? ""}
                                            onChange={(e) => handleInputChange("small_company_percent", e.target.value ? parseFloat(e.target.value) : null)}
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                                <div className="w-full flex gap-2 items-center md:flex-row flex-col">
                                    <div className="w-full flex flex-col gap-2">
                                        <label className="block text-sm font-medium text-gray-700">医師なし</label>
                                        <Input
                                            value={service.no_doctor || ""}
                                            onChange={(e) => handleInputChange("no_doctor", e.target.value)}
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="w-full flex flex-col gap-2">
                                        <label className="block text-sm font-medium text-gray-700">医師なし率 (%)</label>
                                        <Input
                                            type="number"
                                            value={service.no_doctor_percent ?? ""}
                                            onChange={(e) => handleInputChange("no_doctor_percent", e.target.value ? parseFloat(e.target.value) : null)}
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                            </div>


                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                                <Button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-1 bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
                                >
                                    {isSaving ? "保存中..." : "保存"}
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={isSaving}
                                    variant="destructive"
                                    className="flex-1 disabled:opacity-50 bg-red-400 text-white hover:bg-red-500"
                                >
                                    削除
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </>
    );
}
