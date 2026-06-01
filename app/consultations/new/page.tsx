import AppLayout from "@/components/AppLayout";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { redirect } from "next/navigation";

type NewConsultationPageProps = {
    searchParams: Promise<{
        customerId?: string;
    }>;
};

type Customer = {
    id: string;
    name: string;
    phone: string | null;
    tax_type: string | null;
};

async function createConsultation(formData: FormData) {
    "use server";

    const customerId = String(formData.get("customer_id") ?? "");
    const consultDate = String(formData.get("consult_date") ?? "");
    const category = String(formData.get("category") ?? "").trim();
    const title = String(formData.get("title") ?? "").trim();
    const content = String(formData.get("content") ?? "").trim();
    const status = String(formData.get("status") ?? "").trim();
    const fileUrl = String(formData.get("file_url") ?? "").trim();

    if (!customerId || !title) {
        throw new Error("고객과 상담 제목은 필수입니다.");
    }

    const { error } = await supabase
        .from("consultations")
        .insert({
            customer_id: customerId,
            consult_date: consultDate || new Date().toISOString().slice(0, 10),
            category,
            title,
            content,
            status,
            file_url: fileUrl,
        });

    if (error) {
        throw new Error(error.message);
    }

    redirect(`/customers/${customerId}`);
}

export default async function NewConsultationPage({
    searchParams,
}: NewConsultationPageProps) {
    const { customerId } = await searchParams;

    const { data: customers } = await supabase
        .from("customers")
        .select("id, name, phone, tax_type")
        .order("created_at", { ascending: false });

    const customerList = (customers ?? []) as Customer[];
    const selectedCustomer = customerList.find((item) => item.id === customerId);

    return (
        <AppLayout>
            <div className="mb-8">
                <Link
                    href={selectedCustomer ? `/customers/${selectedCustomer.id}` : "/consultations"}
                    className="text-green-600 text-sm font-medium"
                >
                    ← 돌아가기
                </Link>

                <h2 className="text-3xl font-bold mt-4 mb-2 text-gray-900">
                    상담 등록
                </h2>

                <p className="text-gray-500">
                    고객별 상담 이력과 파일 링크를 등록합니다.
                </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-4xl">
                <form action={createConsultation} className="space-y-8">
                    <section>
                        <h3 className="text-xl font-bold mb-5 text-gray-900">
                            상담 기본정보
                        </h3>

                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    고객 선택
                                </label>

                                <select
                                    name="customer_id"
                                    required
                                    defaultValue={customerId ?? ""}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none text-gray-900"
                                >
                                    <option value="">고객을 선택하세요</option>

                                    {customerList.map((customer) => (
                                        <option key={customer.id} value={customer.id}>
                                            {customer.name} / {customer.phone || "연락처 없음"}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    상담일
                                </label>

                                <input
                                    type="date"
                                    name="consult_date"
                                    defaultValue={new Date().toISOString().slice(0, 10)}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none text-gray-900"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    상담 세목
                                </label>

                                <select
                                    name="category"
                                    defaultValue={selectedCustomer?.tax_type ?? "양도소득세"}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none text-gray-900"
                                >
                                    <option>양도소득세</option>
                                    <option>취득세</option>
                                    <option>상속세</option>
                                    <option>증여세</option>
                                    <option>종합부동산세</option>
                                    <option>법인세</option>
                                    <option>기타</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    처리상태
                                </label>

                                <select
                                    name="status"
                                    defaultValue="검토중"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none text-gray-900"
                                >
                                    <option>검토중</option>
                                    <option>자료요청</option>
                                    <option>상담완료</option>
                                    <option>신고완료</option>
                                </select>
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    상담 제목
                                </label>

                                <input
                                    name="title"
                                    required
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none text-gray-900"
                                    placeholder="예: 1세대 1주택 비과세 검토"
                                />
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold mb-5 text-gray-900">
                            상담 내용
                        </h3>

                        <textarea
                            name="content"
                            className="w-full h-48 border border-gray-200 rounded-xl px-4 py-3 outline-none text-gray-900 resize-none"
                            placeholder="상담 내용, 검토사항, 필요한 자료 등을 입력하세요."
                        />
                    </section>

                    <section>
                        <h3 className="text-xl font-bold mb-5 text-gray-900">
                            파일 링크
                        </h3>

                        <input
                            name="file_url"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none text-gray-900"
                            placeholder="Google Drive 파일 링크를 붙여넣으세요."
                        />
                    </section>

                    <div className="flex justify-end gap-3 pt-4">
                        <Link
                            href={selectedCustomer ? `/customers/${selectedCustomer.id}` : "/consultations"}
                            className="px-5 py-3 rounded-xl border border-gray-200 text-gray-700"
                        >
                            취소
                        </Link>

                        <button
                            type="submit"
                            className="px-5 py-3 rounded-xl bg-green-600 text-white font-semibold"
                        >
                            상담 저장
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}