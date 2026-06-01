import AppLayout from "@/components/AppLayout";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type UploadFilePageProps = {
    searchParams: Promise<{
        customerId?: string;
    }>;
};

type Customer = {
    id: string;
    name: string;
    phone: string | null;
};

export default async function UploadFilePage({ searchParams }: UploadFilePageProps) {
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
                    파일 업로드
                </h2>

                <p className="text-gray-500">
                    실제 파일을 Supabase Storage에 저장합니다.
                </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-4xl">
                <form
                    action="/api/files/upload"
                    method="post"
                    encType="multipart/form-data"
                    className="space-y-8"
                >
                    <section>
                        <h3 className="text-xl font-bold mb-5 text-gray-900">
                            파일 정보
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
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none text-gray-900 bg-white"
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
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none text-gray-900 bg-white"
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
                                    파일 선택
                                </label>

                                <input
                                    type="file"
                                    name="file"
                                    required
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none text-gray-900 bg-white"
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
                            파일 업로드
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}