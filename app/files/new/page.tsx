import AppLayout from "@/components/AppLayout";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { redirect } from "next/navigation";

type NewFilePageProps = {
    searchParams: Promise<{
        customerId?: string;
    }>;
};

type Customer = {
    id: string;
    name: string;
    phone: string | null;
};

async function createFile(formData: FormData) {
    "use server";

    const customerId = String(formData.get("customer_id") ?? "");
    const fileName = String(formData.get("file_name") ?? "").trim();
    const fileType = String(formData.get("file_type") ?? "").trim();
    const fileUrl = String(formData.get("file_url") ?? "").trim();
    const memo = String(formData.get("memo") ?? "").trim();

    if (!customerId || !fileName || !fileUrl) {
        throw new Error("고객, 파일명, 파일 링크는 필수입니다.");
    }

    const { error } = await supabase
        .from("files")
        .insert({
            customer_id: customerId,
            file_name: fileName,
            file_type: fileType,
            file_url: fileUrl,
            memo,
        });

    if (error) {
        throw new Error(error.message);
    }

    redirect(`/customers/${customerId}`);
}

export default async function NewFilePage({ searchParams }: NewFilePageProps) {
    const { customerId } = await searchParams;

    const { data: customers } = await supabase
        .from("customers")
        .select("id, name, phone")
        .order("created_at", { ascending: false });

    const customerList = (customers ?? []) as Customer[];
    const selectedCustomer = customerList.find((item) => item.id === customerId);

    return (
        <AppLayout>
            <div className="mb-8">
                <Link
                    href={selectedCustomer ? `/customers/${selectedCustomer.id}` : "/customers"}
                    className="text-green-600 text-sm font-medium"
                >
                    ← 돌아가기
                </Link>

                <h2 className="text-3xl font-bold mt-4 mb-2 text-gray-900">
                    파일 등록
                </h2>

                <p className="text-gray-500">
                    Google Drive 등에 저장한 파일 링크를 고객별로 관리합니다.
                </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-4xl">
                <form action={createFile} className="space-y-8">
                    <section>
                        <h3 className="text-xl font-bold mb-5 text-gray-900">
                            파일 기본정보
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
                                    파일 유형
                                </label>

                                <select
                                    name="file_type"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none text-gray-900"
                                >
                                    <option>등기부등본</option>
                                    <option>매매계약서</option>
                                    <option>가족관계증명서</option>
                                    <option>주민등록등본</option>
                                    <option>신고서</option>
                                    <option>계산자료</option>
                                    <option>기타</option>
                                </select>
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    파일명
                                </label>

                                <input
                                    name="file_name"
                                    required
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none text-gray-900"
                                    placeholder="예: 홍길동 등기부등본"
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    파일 링크
                                </label>

                                <input
                                    name="file_url"
                                    required
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none text-gray-900"
                                    placeholder="Google Drive 공유 링크를 붙여넣으세요."
                                />
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold mb-5 text-gray-900">
                            메모
                        </h3>

                        <textarea
                            name="memo"
                            className="w-full h-32 border border-gray-200 rounded-xl px-4 py-3 outline-none text-gray-900 resize-none"
                            placeholder="파일 관련 메모를 입력하세요."
                        />
                    </section>

                    <div className="flex justify-end gap-3 pt-4">
                        <Link
                            href={selectedCustomer ? `/customers/${selectedCustomer.id}` : "/customers"}
                            className="px-5 py-3 rounded-xl border border-gray-200 text-gray-700"
                        >
                            취소
                        </Link>

                        <button
                            type="submit"
                            className="px-5 py-3 rounded-xl bg-green-600 text-white font-semibold"
                        >
                            파일 저장
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}