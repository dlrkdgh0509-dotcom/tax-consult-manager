import AppLayout from "@/components/AppLayout";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { redirect } from "next/navigation";

type NewTaskPageProps = {
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

async function createTask(formData: FormData) {
    "use server";

    const customerId = String(formData.get("customer_id") ?? "");
    const title = String(formData.get("title") ?? "").trim();
    const dueDate = String(formData.get("due_date") ?? "");
    const status = String(formData.get("status") ?? "미완료").trim();
    const memo = String(formData.get("memo") ?? "").trim();

    if (!customerId || !title) {
        throw new Error("고객과 할 일 제목은 필수입니다.");
    }

    const { error } = await supabase
        .from("tasks")
        .insert({
            customer_id: customerId,
            title,
            due_date: dueDate || null,
            status,
            memo,
        });

    if (error) {
        throw new Error(error.message);
    }

    redirect(`/customers/${customerId}`);
}

export default async function NewTaskPage({ searchParams }: NewTaskPageProps) {
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
                    href={selectedCustomer ? `/customers/${selectedCustomer.id}` : "/tasks"}
                    className="text-green-600 text-sm font-medium"
                >
                    ← 돌아가기
                </Link>

                <h2 className="text-3xl font-bold mt-4 mb-2 text-gray-900">
                    할 일 등록
                </h2>

                <p className="text-gray-500">
                    자료 요청, 신고기한, 다음 연락일 등을 등록합니다.
                </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-4xl">
                <form action={createTask} className="space-y-8">
                    <section>
                        <h3 className="text-xl font-bold mb-5 text-gray-900">
                            할 일 기본정보
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
                                    마감일
                                </label>

                                <input
                                    type="date"
                                    name="due_date"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none text-gray-900"
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    할 일 제목
                                </label>

                                <input
                                    name="title"
                                    required
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none text-gray-900"
                                    placeholder="예: 등기부등본 요청"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    처리상태
                                </label>

                                <select
                                    name="status"
                                    defaultValue="미완료"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none text-gray-900"
                                >
                                    <option>미완료</option>
                                    <option>완료</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold mb-5 text-gray-900">
                            메모
                        </h3>

                        <textarea
                            name="memo"
                            className="w-full h-40 border border-gray-200 rounded-xl px-4 py-3 outline-none text-gray-900 resize-none"
                            placeholder="요청자료, 확인사항, 다음 연락 내용 등을 입력하세요."
                        />
                    </section>

                    <div className="flex justify-end gap-3 pt-4">
                        <Link
                            href={selectedCustomer ? `/customers/${selectedCustomer.id}` : "/tasks"}
                            className="px-5 py-3 rounded-xl border border-gray-200 text-gray-700"
                        >
                            취소
                        </Link>

                        <button
                            type="submit"
                            className="px-5 py-3 rounded-xl bg-green-600 text-white font-semibold"
                        >
                            할 일 저장
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}