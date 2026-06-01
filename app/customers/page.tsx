import AppLayout from "@/components/AppLayout";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type CustomersPageProps = {
    searchParams: Promise<{
        q?: string;
    }>;
};

type Customer = {
    id: string;
    name: string;
    phone: string | null;
    tax_type: string | null;
    status: string | null;
    memo: string | null;
    file_url: string | null;
    created_at: string;
};

export default async function CustomersPage({ searchParams }: CustomersPageProps) {
    const { q } = await searchParams;
    const keyword = q?.trim() ?? "";

    let query = supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false });

    if (keyword) {
        query = query.or(
            `name.ilike.%${keyword}%,phone.ilike.%${keyword}%,tax_type.ilike.%${keyword}%,status.ilike.%${keyword}%,memo.ilike.%${keyword}%`
        );
    }

    const { data: customers, error } = await query;

    const customerList = (customers ?? []) as Customer[];

    return (
        <AppLayout>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold mb-2 text-gray-900">
                        고객관리
                    </h2>

                    <p className="text-gray-500">
                        고객 기본정보와 상담 상태를 관리합니다.
                    </p>
                </div>

                <Link
                    href="/customers/new"
                    className="px-5 py-3 bg-green-600 text-white rounded-xl font-semibold"
                >
                    고객 등록
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <form className="mb-5 flex gap-3">
                    <input
                        name="q"
                        defaultValue={keyword}
                        className="flex-1 border border-gray-200 rounded-xl px-4 py-3 outline-none text-gray-900"
                        placeholder="고객명, 연락처, 세목, 상태, 메모로 검색"
                    />

                    <button
                        type="submit"
                        className="px-5 py-3 rounded-xl bg-gray-900 text-white font-semibold"
                    >
                        검색
                    </button>

                    {keyword && (
                        <Link
                            href="/customers"
                            className="px-5 py-3 rounded-xl border border-gray-200 text-gray-700"
                        >
                            초기화
                        </Link>
                    )}
                </form>

                {keyword && (
                    <p className="text-sm text-gray-500 mb-4">
                        검색어: <span className="font-semibold text-gray-800">{keyword}</span> ·{" "}
                        결과 {customerList.length}건
                    </p>
                )}

                {error && (
                    <div className="p-4 mb-4 rounded-xl bg-red-50 text-red-600">
                        고객 목록을 불러오지 못했습니다.
                    </div>
                )}

                {!error && customerList.length === 0 && (
                    <div className="p-10 text-center text-gray-500">
                        {keyword ? "검색 결과가 없습니다." : "아직 등록된 고객이 없습니다."}
                    </div>
                )}

                <div className="space-y-3">
                    {customerList.map((customer) => (
                        <div
                            key={customer.id}
                            className="border border-gray-100 rounded-xl p-5 flex items-center justify-between"
                        >
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <strong className="text-lg text-gray-900">
                                        {customer.name}
                                    </strong>

                                    <span className="text-sm px-3 py-1 rounded-full bg-green-50 text-green-700">
                                        {customer.status ?? "검토중"}
                                    </span>
                                </div>

                                <p className="text-gray-500 text-sm">
                                    {customer.phone || "연락처 없음"}
                                </p>

                                <p className="text-gray-500 text-sm mt-1">
                                    {(customer.tax_type || "세목 미지정") +
                                        " · " +
                                        (customer.memo || "메모 없음")}
                                </p>
                            </div>

                            <Link
                                href={`/customers/${customer.id}`}
                                className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700"
                            >
                                상세보기
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}