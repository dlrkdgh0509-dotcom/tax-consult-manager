export const dynamic = "force-dynamic";
import AppLayout from "@/components/AppLayout";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { redirect } from "next/navigation";

type EditTaskPageProps = {
    params: Promise<{
        id: string;
    }>;
};

type Customer = {
    id: string;
    name: string;
    phone: string | null;
};

async function updateTask(formData: FormData) {
    "use server";

    const id = String(formData.get("id") ?? "");
    const customerId = String(formData.get("customer_id") ?? "");
    const title = String(formData.get("title") ?? "").trim();
    const dueDate = String(formData.get("due_date") ?? "");
    const status = String(formData.get("status") ?? "미완료").trim();
    const memo = String(formData.get("memo") ?? "").trim();

    if (!id || !customerId || !title) {
        throw new Error("할 일 ID, 고객, 제목은 필수입니다.");
    }

    const { error } = await supabase
        .from("tasks")
        .update({
            customer_id: customerId,
            title,
            due_date: dueDate || null,
            status,
            memo,
        })
        .eq("id", id);

    if (error) {
        throw new Error(error.message);
    }

    redirect(`/customers/${customerId}`);
}

async function deleteTask(formData: FormData) {
    "use server";

    const id = String(formData.get("id") ?? "");
    const customerId = String(formData.get("customer_id") ?? "");

    if (!id || !customerId) {
        throw new Error("삭제할 할 일 정보가 없습니다.");
    }

    const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", id);

    if (error) {
        throw new Error(error.message);
    }

    redirect(`/customers/${customerId}`);
}

export default async function EditTaskPage({ params }: EditTaskPageProps) {
    const { id } = await params;

    const { data: task, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("id", id)
        .single();

    const { data: customers } = await supabase
        .from("customers")
        .select("id, name, phone")
        .order("created_at", { ascending: false });

    const customerList = (customers ?? []) as Customer[];

    if (error || !task) {
        return (
            <AppLayout>
                <h2 className="text-3xl font-bold mb-4 text-gray-900">
                    할 일 정보를 찾을 수 없습니다.
                </h2>

                <Link href="/tasks" className="text-green-600">
                    할일관리로 돌아가기
                </Link>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="mb-8">
                <Link
                    href={`/customers/${task.customer_id}`}
                    className="text-green-600 text-sm font-medium"
                >
                    ← 고객 상세로 돌아가기
                </Link>

                <h2 className="text-3xl font-bold mt-4 mb-2 text-gray-900">
                    할 일 수정
                </h2>

                <p className="text-gray-500">
                    자료 요청, 신고기한, 다음 연락일 등을 수정하거나 삭제합니다.
                </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-4xl">
                <form action={updateTask} className="space-y-8">
                    <input type="hidden" name="id" value={task.id} />

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
                                    defaultValue={task.customer_id}
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
                                    마감일
                                </label>

                                <input
                                    type="date"
                                    name="due_date"
                                    defaultValue={task.due_date ?? ""}
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
                                    defaultValue={task.title}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none text-gray-900"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    처리상태
                                </label>

                                <select
                                    name="status"
                                    defaultValue={task.status ?? "미완료"}
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
                            defaultValue={task.memo ?? ""}
                            className="w-full h-40 border border-gray-200 rounded-xl px-4 py-3 outline-none text-gray-900 resize-none"
                        />
                    </section>

                    <div className="flex justify-between gap-3 pt-4">
                        <button
                            formAction={deleteTask}
                            className="px-5 py-3 rounded-xl bg-red-500 text-white font-semibold"
                        >
                            할 일 삭제
                        </button>

                        <div className="flex gap-3">
                            <Link
                                href={`/customers/${task.customer_id}`}
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