import AppLayout from "@/components/AppLayout";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { redirect } from "next/navigation";

async function createCustomer(formData: FormData) {
    "use server";

    const name = String(formData.get("name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const taxType = String(formData.get("tax_type") ?? "").trim();
    const status = String(formData.get("status") ?? "").trim();
    const memo = String(formData.get("memo") ?? "").trim();
    const fileUrl = String(formData.get("file_url") ?? "").trim();

    if (!name) {
        throw new Error("고객명은 필수입니다.");
    }

    const { error } = await supabase
        .from("customers")
        .insert({
            name,
            phone,
            tax_type: taxType,
            status,
            memo,
            file_url: fileUrl,
        });

    if (error) {
        throw new Error(error.message);
    }

    redirect("/customers");
}

export default function NewCustomerPage() {
    return (
        <AppLayout>
            <div className="mb-8">
                <Link
                    href="/customers"
                    className="text-green-600 text-sm font-medium"
                >
                    ← 고객관리로 돌아가기
                </Link>

                <h2 className="text-3xl font-bold mt-4 mb-2 text-gray-900">
                    고객 등록
                </h2>

                <p className="text-gray-500">
                    신규 고객의 기본정보와 상담 메모를 입력합니다.
                </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-4xl">
                <form action={createCustomer} className="space-y-8">
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
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none text-gray-900"
                                    placeholder="예: 홍길동"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    연락처
                                </label>

                                <input
                                    name="phone"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none text-gray-900"
                                    placeholder="예: 010-1234-5678"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    상담 세목
                                </label>

                                <select
                                    name="tax_type"
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
                            className="w-full h-40 border border-gray-200 rounded-xl px-4 py-3 outline-none text-gray-900 resize-none"
                            placeholder="고객 상담 내용, 확인할 사항, 특이사항 등을 입력하세요."
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
                            href="/customers"
                            className="px-5 py-3 rounded-xl border border-gray-200 text-gray-700"
                        >
                            취소
                        </Link>

                        <button
                            type="submit"
                            className="px-5 py-3 rounded-xl bg-green-600 text-white font-semibold"
                        >
                            저장하기
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}