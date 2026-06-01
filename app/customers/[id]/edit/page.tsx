import AppLayout from "@/components/AppLayout";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { redirect } from "next/navigation";

type EditCustomerPageProps = {
    params: Promise<{
        id: string;
    }>;
};

async function updateCustomer(formData: FormData) {
    "use server";

    const id = String(formData.get("id") ?? "");
    const name = String(formData.get("name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const taxType = String(formData.get("tax_type") ?? "").trim();
    const status = String(formData.get("status") ?? "").trim();
    const memo = String(formData.get("memo") ?? "").trim();
    const fileUrl = String(formData.get("file_url") ?? "").trim();

    if (!id || !name) {
        throw new Error("고객 ID와 고객명은 필수입니다.");
    }

    const { error } = await supabase
        .from("customers")
        .update({
            name,
            phone,
            tax_type: taxType,
            status,
            memo,
            file_url: fileUrl,
        })
        .eq("id", id);

    if (error) {
        throw new Error(error.message);
    }

    redirect(`/customers/${id}`);
}

export default async function EditCustomerPage({ params }: EditCustomerPageProps) {
    const { id } = await params;

    const { data: customer, error } = await supabase
        .from("customers")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !customer) {
        return (
            <AppLayout>
                <h2 className="text-3xl font-bold mb-4 text-gray-900">
                    고객 정보를 찾을 수 없습니다.
                </h2>

                <Link href="/customers" className="text-green-600">
                    고객관리로 돌아가기
                </Link>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="mb-8">
                <Link
                    href={`/customers/${id}`}
                    className="text-green-600 text-sm font-medium"
                >
                    ← 고객 상세로 돌아가기
                </Link>

                <h2 className="text-3xl font-bold mt-4 mb-2 text-gray-900">
                    고객 수정
                </h2>

                <p className="text-gray-500">
                    고객 기본정보와 상담 메모를 수정합니다.
                </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-4xl">
                <form action={updateCustomer} className="space-y-8">
                    <input type="hidden" name="id" value={customer.id} />

                    <section>
                        <h3 className="text-xl font-bold mb-5 text-gray-900">
                            기본정보
                        </h3>

                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    고객명
                                </label>

                                <input
                                    name="name"
                                    required
                                    defaultValue={customer.name ?? ""}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none text-gray-900"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    연락처
                                </label>

                                <input
                                    name="phone"
                                    defaultValue={customer.phone ?? ""}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none text-gray-900"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    상담 세목
                                </label>

                                <select
                                    name="tax_type"
                                    defaultValue={customer.tax_type ?? "양도소득세"}
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
                                    defaultValue={customer.status ?? "검토중"}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none text-gray-900"
                                >
                                    <option>검토중</option>
                                    <option>자료요청</option>
                                    <option>상담완료</option>
                                    <option>신고완료</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold mb-5 text-gray-900">
                            상담 메모
                        </h3>

                        <textarea
                            name="memo"
                            defaultValue={customer.memo ?? ""}
                            className="w-full h-40 border border-gray-200 rounded-xl px-4 py-3 outline-none text-gray-900 resize-none"
                        />
                    </section>

                    <section>
                        <h3 className="text-xl font-bold mb-5 text-gray-900">
                            파일 링크
                        </h3>

                        <input
                            name="file_url"
                            defaultValue={customer.file_url ?? ""}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none text-gray-900"
                        />
                    </section>

                    <div className="flex justify-end gap-3 pt-4">
                        <Link
                            href={`/customers/${id}`}
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
                </form>
            </div>
        </AppLayout>
    );
}