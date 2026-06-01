import AppLayout from "@/components/AppLayout";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { redirect } from "next/navigation";

type EditFilePageProps = {
    params: Promise<{
        id: string;
    }>;
};

type Customer = {
    id: string;
    name: string;
    phone: string | null;
};

async function updateFile(formData: FormData) {
    "use server";

    const id = String(formData.get("id") ?? "");
    const customerId = String(formData.get("customer_id") ?? "");
    const fileName = String(formData.get("file_name") ?? "").trim();
    const fileType = String(formData.get("file_type") ?? "").trim();
    const fileUrl = String(formData.get("file_url") ?? "").trim();
    const memo = String(formData.get("memo") ?? "").trim();

    if (!id || !customerId || !fileName || !fileUrl) {
        throw new Error("파일 ID, 고객, 파일명, 파일 링크는 필수입니다.");
    }

    const { error } = await supabase
        .from("files")
        .update({
            customer_id: customerId,
            file_name: fileName,
            file_type: fileType,
            file_url: fileUrl,
            memo,
        })
        .eq("id", id);

    if (error) {
        throw new Error(error.message);
    }

    redirect(`/customers/${customerId}`);
}

async function deleteFile(formData: FormData) {
    "use server";

    const id = String(formData.get("id") ?? "");
    const customerId = String(formData.get("customer_id") ?? "");

    if (!id || !customerId) {
        throw new Error("삭제할 파일 정보가 없습니다.");
    }

    const { error } = await supabase
        .from("files")
        .delete()
        .eq("id", id);

    if (error) {
        throw new Error(error.message);
    }

    redirect(`/customers/${customerId}`);
}

export default async function EditFilePage({ params }: EditFilePageProps) {
    const { id } = await params;

    const { data: file, error } = await supabase
        .from("files")
        .select("*")
        .eq("id", id)
        .single();

    const { data: customers } = await supabase
        .from("customers")
        .select("id, name, phone")
        .order("created_at", { ascending: false });

    const customerList = (customers ?? []) as Customer[];

    if (error || !file) {
        return (
            <AppLayout>
                <h2 className="text-3xl font-bold mb-4 text-gray-900">
                    파일 정보를 찾을 수 없습니다.
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
                    href={`/customers/${file.customer_id}`}
                    className="text-green-600 text-sm font-medium"
                >
                    ← 고객 상세로 돌아가기
                </Link>

                <h2 className="text-3xl font-bold mt-4 mb-2 text-gray-900">
                    파일 수정
                </h2>

                <p className="text-gray-500">
                    고객별 파일 링크 정보를 수정하거나 삭제합니다.
                </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-4xl">
                <form action={updateFile} className="space-y-8">
                    <input type="hidden" name="id" value={file.id} />

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
                                    defaultValue={file.customer_id}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none text-gray-900 bg-white"
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
                                    파일 유형
                                </label>

                                <select
                                    name="file_type"
                                    defaultValue={file.file_type ?? "기타"}
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
                                    파일명
                                </label>

                                <input
                                    name="file_name"
                                    required
                                    defaultValue={file.file_name}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none text-gray-900"
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    파일 링크
                                </label>

                                <input
                                    name="file_url"
                                    required
                                    defaultValue={file.file_url}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none text-gray-900"
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
                            defaultValue={file.memo ?? ""}
                            className="w-full h-32 border border-gray-200 rounded-xl px-4 py-3 outline-none text-gray-900 resize-none"
                        />
                    </section>

                    <div className="flex justify-between gap-3 pt-4">
                        <button
                            formAction={deleteFile}
                            className="px-5 py-3 rounded-xl bg-red-500 text-white font-semibold"
                        >
                            파일 삭제
                        </button>

                        <div className="flex gap-3">
                            <Link
                                href={`/customers/${file.customer_id}`}
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