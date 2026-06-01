import { FILE_BUCKET, createStoragePath } from "@/lib/storage";
import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const formData = await request.formData();

    const customerId = String(formData.get("customer_id") ?? "");
    const fileType = String(formData.get("file_type") ?? "").trim();
    const memo = String(formData.get("memo") ?? "").trim();
    const uploadFile = formData.get("file");

    if (!customerId || !(uploadFile instanceof File)) {
        throw new Error("고객과 업로드 파일은 필수입니다.");
    }

    const storagePath = createStoragePath(customerId, uploadFile.name);

    const { error: uploadError } = await supabase.storage
        .from(FILE_BUCKET)
        .upload(storagePath, uploadFile, {
            cacheControl: "3600",
            upsert: false,
        });

    if (uploadError) {
        throw new Error(uploadError.message);
    }

    const { error: insertError } = await supabase
        .from("files")
        .insert({
            customer_id: customerId,
            file_name: uploadFile.name,
            file_type: fileType,
            file_url: storagePath,
            storage_path: storagePath,
            storage_status: "active",
            memo,
        });

    if (insertError) {
        throw new Error(insertError.message);
    }

    redirect(`/customers/${customerId}`);
}