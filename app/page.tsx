import AppLayout from "@/components/AppLayout";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type Customer = {
    id: string;
    name: string;
    phone: string | null;
    tax_type: string | null;
    status: string | null;
    memo: string | null;
    created_at: string;
};

type Task = {
    id: string;
    customer_id: string;
    title: string;
    due_date: string | null;
    status: string | null;
    memo: string | null;
    customers: {
        id: string;
        name: string;
    } | null;
};

export default async function Home() {
    const today = new Date().toISOString().slice(0, 10);

    const { count: customerCount } = await supabase
        .from("customers")
        .select("*", { count: "exact", head: true });

    const { count: todayConsultationCount } = await supabase
        .from("consultations")
        .select("*", { count: "exact", head: true })
        .eq("consult_date", today);

    const { count: pendingTaskCount } = await supabase
        .from("tasks")
        .select("*", { count: "exact", head: true })
        .eq("status", "미완료");

    const { data: recentCustomers } = await supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

    const { data: pendingTasks } = await supabase
        .from("tasks")
        .select(`
            *,
            customers (
                id,
                name
            )
        `)
        .eq("status", "미완료")
        .order("due_date", { ascending: true })
        .limit(5);

    const customerList = (recentCustomers ?? []) as Customer[];
    const taskList = (pendingTasks ?? []) as Task[];

    return (
        <AppLayout>
            <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2 text-gray-900">
                    대시보드
                </h2>

                <p className="text-gray-500">
                    고객 상담 현황과 처리할 업무를 확인합니다.
                </p>
            </div>

            <div className="grid grid-cols-3 gap-5 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 mb-3">
                        전체 고객 수
                    </p>

                    <strong className="text-4xl text-gray-900">
                        {customerCount ?? 0}
                    </strong>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 mb-3">
                        오늘 상담
                    </p>

                    <strong className="text-4xl text-gray-900">
                        {todayConsultationCount ?? 0}
                    </strong>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 mb-3">
                        미완료 업무
                    </p>

                    <strong className="text-4xl text-gray-900">
                        {pendingTaskCount ?? 0}
                    </strong>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-900">
                            최근 고객
                        </h3>

                        <Link href="/customers" className="text-sm text-green-600">
                            전체보기
                        </Link>
                    </div>

                    {customerList.length === 0 ? (
                        <p className="text-gray-500">
                            등록된 고객이 없습니다.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {customerList.map((customer) => (
                                <Link
                                    key={customer.id}
                                    href={`/customers/${customer.id}`}
                                    className="block border border-gray-100 rounded-xl p-4 hover:bg-gray-50"
                                >
                                    <div className="flex justify-between mb-1">
                                        <strong className="text-gray-900">
                                            {customer.name}
                                        </strong>

                                        <span className="text-sm text-green-600">
                                            {customer.status || "검토중"}
                                        </span>
                                    </div>

                                    <p className="text-sm text-gray-500">
                                        {customer.phone || "연락처 없음"}
                                    </p>

                                    <p className="text-sm text-gray-500 mt-1">
                                        {customer.tax_type || "세목 미지정"}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-900">
                            처리할 업무
                        </h3>

                        <Link href="/tasks" className="text-sm text-green-600">
                            전체보기
                        </Link>
                    </div>

                    {taskList.length === 0 ? (
                        <p className="text-gray-500">
                            미완료 업무가 없습니다.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {taskList.map((task) => (
                                <Link
                                    key={task.id}
                                    href={`/customers/${task.customer_id}`}
                                    className="block border border-gray-100 rounded-xl p-4 hover:bg-gray-50"
                                >
                                    <div className="flex justify-between mb-1">
                                        <strong className="text-gray-900">
                                            {task.title}
                                        </strong>

                                        <span className="text-sm text-red-500">
                                            {task.status || "미완료"}
                                        </span>
                                    </div>

                                    <p className="text-sm text-gray-500">
                                        {task.customers?.name || "고객 없음"}
                                    </p>

                                    <p className="text-sm text-gray-500 mt-1">
                                        마감일: {task.due_date || "미지정"}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}