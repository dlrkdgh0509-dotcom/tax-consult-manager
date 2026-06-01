export const dynamic = "force-dynamic";
import AppLayout from "@/components/AppLayout";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type ConsultationWithCustomer = {
    id: string;
    customer_id: string;
    consult_date: string;
    category: string | null;
    title: string;
    content: string | null;
    status: string | null;
    file_url: string | null;
    created_at: string;
    customers: {
        id: string;
        name: string;
        phone: string | null;
    } | null;
};

export default async function ConsultationsPage() {
    const { data: consultations, error } = await supabase
        .from("consultations")
        .select(`
            *,
            customers (
                id,
                name,
                phone
            )
        `)
        .order("consult_date", { ascending: false });

    const consultationList = (consultations ?? []) as ConsultationWithCustomer[];

    return (
        <AppLayout>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold mb-2 text-gray-900">
                        상담관리
                    </h2>

                    <p className="text-gray-500">
                        고객별 상담 이력과 첨부파일 링크를 관리합니다.
                    </p>
                </div>

                <Link
                    href="/consultations/new"
                    className="px-5 py-3 bg-green-600 text-white rounded-xl font-semibold"
                >
                    상담 등록
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                {error && (
                    <div className="p-4 mb-4 rounded-xl bg-red-50 text-red-600">
                        상담 목록을 불러오지 못했습니다.
                    </div>
                )}

                {!error && consultationList.length === 0 && (
                    <div className="p-10 text-center text-gray-500">
                        아직 등록된 상담 이력이 없습니다.
                    </div>
                )}

                <div className="space-y-3">
                    {consultationList.map((consultation) => (
                        <div
                            key={consultation.id}
                            className="border border-gray-100 rounded-xl p-5"
                        >
                            <div className="flex justify-between mb-3">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <strong className="text-lg text-gray-900">
                                            {consultation.title}
                                        </strong>

                                        <span className="text-sm px-3 py-1 rounded-full bg-green-50 text-green-700">
                                            {consultation.status || "검토중"}
                                        </span>
                                    </div>

                                    <p className="text-sm text-gray-500">
                                        {consultation.customers?.name || "고객 없음"} ·{" "}
                                        {consultation.consult_date} ·{" "}
                                        {consultation.category || "기타"}
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    {consultation.customers?.id && (
                                        <Link
                                            href={`/customers/${consultation.customers.id}`}
                                            className="text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50"
                                        >
                                            고객 보기
                                        </Link>
                                    )}

                                    {consultation.file_url && (
                                        <a
                                            href={consultation.file_url}
                                            target="_blank"
                                            className="text-sm text-green-600 border border-green-100 rounded-lg px-3 py-2 hover:bg-green-50"
                                        >
                                            파일 열기
                                        </a>
                                    )}
                                </div>
                            </div>

                            <p className="text-gray-700 whitespace-pre-wrap">
                                {consultation.content || "상담 내용 없음"}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}