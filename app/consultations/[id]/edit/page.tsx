import AppLayout from "@/components/AppLayout";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { redirect } from "next/navigation";

type EditConsultationPageProps = {
    params: Promise<{
        id: string;
    }>;
};

type Customer = {
    id: string;
    name: string;
    phone: string | null;
    tax_type: string | null;
};

async function updateConsultation(formData: FormData) {
    "use server";

    const id = String(formData.get("id") ?? "");
    const customerId = String(formData.get("customer_id") ?? "");
    const consultDate = String(formData.get("consult_date") ?? "");
    const category = String(formData.get("category") ?? "").trim();
    const title = String(formData.get("title") ?? "").trim();
    const content = String(formData.get("content") ?? "").trim();
    const status = String(formData.get("status") ?? "").trim();
    const fileUrl = String(formData.get("file_url") ?? "").trim();

    if (!id || !customerId || !title) {
        throw new Error("상담 ID, 고객, 상담 제목은 필수입니다.");
    }

    const { error } = await supabase
        .from("consultations")
        .update({
            customer_id: customerId,
            consult_date: consultDate,
            category,
            title,
            content,
            status,
            file_url: fileUrl,
        })
        .eq("id", id);

    if (error) {
        throw new Error(error.message);
    }

    redirect(`/customers/${customerId}`);
}

async function deleteConsultation(formData: FormData) {
    "use server";

    const id = String(formData.get("id") ?? "");
    const customerId = String(formData.get("customer_id") ?? "");

    if (!id || !customerId) {
        throw new Error("삭제할 상담 정보가 없습니다.");
    }

    const { error } = await supabase
        .from("consultations")
        .delete()
        .eq("id", id);

    if (error) {
        throw new Error(error.message);
    }

    redirect(`/customers/${customerId}`);
}

export default async function EditConsultationPage({
    params,
}: EditConsultationPageProps) {
    const { id } = await params;

    const { data: consultation, error } = await supabase
        .from("consultations")
        .select("*")
        .eq("id", id)
        .single();

    const { data: customers } = await supabase
        .from("customers")
        .select("id, name, phone, tax_type")
        .order("created_at", { ascending: false });

    const customerList = (customers ?? []) as Customer[];

    if (error || !consultation) {
        return (
            <AppLayout>
                <h2 className="text-3xl font-bold mb-4 text-gray-900">
                    상담 정보를 찾을 수 없습니다.
                </h2>

                <Link href="/consultations" className="text-green-600">
                    상담관리로 돌아가기
                </Link>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="mb-8">
                <Link
                    href={`/customers/${consultation.customer_id}`}
                    className="text-green-600 text-sm font-medium"
                >
                    ← 고객 상세로 돌아가기
                </Link>

                <h2 className="text-3xl font-bold mt-4 mb-2 text-gray-900">
                    상담 수정
                </h2>

                <p className="text-gray-500">
                    상담 이력과 파일 링크를 수정하거나 삭제합니다.
                </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-4xl">
                <form action={updateConsultation} className="space-y-8">
                    <input type="hidden" name="id" value={consultation.id} />

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
                                    defaultValue={consultation.customer_id}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none text-gray-900"
                                >
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
                                    defaultValue={consultation.consult_date}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none text-gray-900"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    상담 세목
                                </label>

                                <select
                                    name="category"
                                    defaultValue={consultation.category ?? "양도소득세"}
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
                                    defaultValue={consultation.status ?? "검토중"}
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
                                    defaultValue={consultation.title}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none text-gray-900"
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
                            defaultValue={consultation.content ?? ""}
                            className="w-full h-48 border border-gray-200 rounded-xl px-4 py-3 outline-none text-gray-900 resize-none"
                        />
                    </section>

                    <section>
                        <h3 className="text-xl font-bold mb-5 text-gray-900">
                            파일 링크
                        </h3>

                        <input
                            name="file_url"
                            defaultValue={consultation.file_url ?? ""}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none text-gray-900"
                        />
                    </section>

                    <div className="flex justify-between gap-3 pt-4">
                        <button
                            formAction={deleteConsultation}
                            className="px-5 py-3 rounded-xl bg-red-500 text-white font-semibold"
                        >
                            상담 삭제
                        </button>

                        <div className="flex gap-3">
                            <Link
                                href={`/customers/${consultation.customer_id}`}
                                className="px-5 py-3 rounded-xl border border-gray-200 text-gray-700"
                            >
                                취소
                            </Link>

                            <button
                                type="submit"
                                className="px-5 py-3 rounded-xl bg-green-600 text-white font-semibold"
                            >
                                수정 저장
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}