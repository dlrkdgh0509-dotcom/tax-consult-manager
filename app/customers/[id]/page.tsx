export const dynamic = "force-dynamic";
import AppLayout from "@/components/AppLayout";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { redirect } from "next/navigation";

type CustomerDetailPageProps = {
    params: Promise<{
        id: string;
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

type Consultation = {
    id: string;
    customer_id: string;
    consult_date: string;
    category: string | null;
    title: string;
    content: string | null;
    status: string | null;
    file_url: string | null;
    created_at: string;
};

type Task = {
    id: string;
    customer_id: string;
    title: string;
    due_date: string | null;
    status: string | null;
    memo: string | null;
    created_at: string;
};

type FileItem = {
    id: string;
    customer_id: string;
    consultation_id: string | null;
    file_name: string;
    file_type: string | null;
    file_url: string;
    memo: string | null;
    created_at: string;
};

async function deleteCustomer(formData: FormData) {
    "use server";

    const id = String(formData.get("id") ?? "");

    if (!id) {
        throw new Error("삭제할 고객 ID가 없습니다.");
    }

    const { error } = await supabase
        .from("customers")
        .delete()
        .eq("id", id);

    if (error) {
        throw new Error(error.message);
    }

    redirect("/customers");
}

export default async function CustomerDetailPage({ params }: CustomerDetailPageProps) {
    const { id } = await params;

    const { data: customer, error: customerError } = await supabase
        .from("customers")
        .select("*")
        .eq("id", id)
        .single();

    if (customerError || !customer) {
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

    const { data: consultations } = await supabase
        .from("consultations")
        .select("*")
        .eq("customer_id", id)
        .order("consult_date", { ascending: false });

    const { data: tasks } = await supabase
        .from("tasks")
        .select("*")
        .eq("customer_id", id)
        .order("created_at", { ascending: false });

    const { data: files } = await supabase
        .from("files")
        .select("*")
        .eq("customer_id", id)
        .order("created_at", { ascending: false });

    const customerData = customer as Customer;
    const consultationList = (consultations ?? []) as Consultation[];
    const taskList = (tasks ?? []) as Task[];
    const fileList = (files ?? []) as FileItem[];

    return (
        <AppLayout>
            <div className="flex items-start justify-between mb-8">
                <div>
                    <Link href="/customers" className="text-green-600 text-sm font-medium">
                        ← 고객관리로 돌아가기
                    </Link>

                    <h2 className="text-3xl font-bold mt-4 mb-2 text-gray-900">
                        {customerData.name}
                    </h2>

                    <p className="text-gray-500">
                        고객 기본정보, 상담 이력, 파일, 할 일을 확인합니다.
                    </p>
                </div>

                <div className="flex gap-2">
                    <Link
                        href={`/customers/${customerData.id}/edit`}
                        className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 bg-white"
                    >
                        고객 수정
                    </Link>

                    <Link
                        href={`/consultations/new?customerId=${customerData.id}`}
                        className="px-4 py-2 rounded-xl bg-green-600 text-white font-semibold"
                    >
                        상담 등록
                    </Link>

                    <Link
                        href={`/tasks/new?customerId=${customerData.id}`}
                        className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold"
                    >
                        할 일 등록
                    </Link>

                    <Link
                        href={`/files/upload?customerId=${customerData.id}`}
                        className="px-4 py-2 rounded-xl bg-purple-600 text-white font-semibold"
                    >
                        파일 업로드
                    </Link>

                    <form action={deleteCustomer}>
                        <input type="hidden" name="id" value={customerData.id} />

                        <button
                            type="submit"
                            className="px-4 py-2 rounded-xl bg-red-500 text-white font-semibold"
                        >
                            고객 삭제
                        </button>
                    </form>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-5 mb-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <p className="text-gray-500 mb-2">연락처</p>
                    <strong className="text-gray-900">
                        {customerData.phone || "미입력"}
                    </strong>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <p className="text-gray-500 mb-2">상담 세목</p>
                    <strong className="text-gray-900">
                        {customerData.tax_type || "미지정"}
                    </strong>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <p className="text-gray-500 mb-2">처리 상태</p>
                    <strong className="text-green-600">
                        {customerData.status || "검토중"}
                    </strong>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                    고객 메모
                </h3>

                <p className="text-gray-700 whitespace-pre-wrap">
                    {customerData.memo || "등록된 메모가 없습니다."}
                </p>

                {customerData.file_url && (
                    <a
                        href={customerData.file_url}
                        target="_blank"
                        className="inline-block mt-4 text-green-600 font-medium"
                    >
                        고객 파일 열기
                    </a>
                )}
            </div>

            <div className="grid grid-cols-3 gap-5">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-xl font-bold mb-4 text-gray-900">
                        상담 이력
                    </h3>

                    {consultationList.length === 0 ? (
                        <p className="text-gray-500">
                            등록된 상담 이력이 없습니다.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {consultationList.map((consultation) => (
                                <div
                                    key={consultation.id}
                                    className="border border-gray-100 rounded-xl p-4"
                                >
                                    <strong className="text-gray-900">
                                        {consultation.title}
                                    </strong>

                                    <p className="text-sm text-gray-500 mt-1">
                                        {consultation.consult_date} · {consultation.category || "기타"}
                                    </p>

                                    <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">
                                        {consultation.content || "상담 내용 없음"}
                                    </p>

                                    {consultation.file_url && (
                                        <a
                                            href={consultation.file_url}
                                            target="_blank"
                                            className="inline-block text-sm text-green-600 mt-2"
                                        >
                                            파일 열기
                                        </a>
                                    )}
                                    
                                    <Link
                                        href={`/consultations/${consultation.id}/edit`}
                                        className="inline-block text-sm text-gray-600 mt-2 ml-3"
                                    >
                                        상담 수정
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-xl font-bold mb-4 text-gray-900">
                        파일 목록
                    </h3>

                    {fileList.length === 0 ? (
                        <p className="text-gray-500">
                            등록된 파일이 없습니다.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {fileList.map((file) => (
                                <div
                                    key={file.id}
                                    className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50"
                                >
                                    <a
                                        href={`/api/files/${file.id}/download`}
                                        target="_blank"
                                        className="block"
                                    >
                                        <strong className="text-gray-900">
                                            {file.file_name}
                                        </strong>

                                        <p className="text-sm text-gray-500 mt-1">
                                            {file.file_type || "파일"} · {file.memo || "메모 없음"}
                                        </p>
                                    </a>

                                    <Link
                                        href={`/files/${file.id}/edit`}
                                        className="inline-block text-sm text-gray-600 mt-2"
                                    >
                                        파일 수정
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-xl font-bold mb-4 text-gray-900">
                        할 일
                    </h3>

                    {taskList.length === 0 ? (
                        <p className="text-gray-500">
                            등록된 할 일이 없습니다.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {taskList.map((task) => (
                                <div
                                    key={task.id}
                                    className="border border-gray-100 rounded-xl p-4"
                                >
                                    <div className="flex justify-between gap-3">
                                        <strong className="text-gray-900">
                                            {task.title}
                                        </strong>

                                        <span className="text-sm text-red-500">
                                            {task.status || "미완료"}
                                        </span>
                                    </div>

                                    <p className="text-sm text-gray-500 mt-2">
                                        마감일: {task.due_date || "미지정"}
                                    </p>

                                    {task.memo && (
                                        <p className="text-sm text-gray-700 mt-2">
                                            {task.memo}
                                        </p>
                                    )}

                                    <Link
                                        href={`/tasks/${task.id}/edit`}
                                        className="inline-block text-sm text-gray-600 mt-2"
                                    >
                                        할 일 수정
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}