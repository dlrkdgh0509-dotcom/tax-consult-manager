import { FILE_BUCKET } from "@/lib/storage";
import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

type RouteProps = {
    params: Promise<{
        id: string;
    }>;
};

export async function GET(_request: NextRequest, { params }: RouteProps) {
    const { id } = await params;

    const { data: file, error } = await supabase
        .from("files")
        .select("storage_path, file_url")
        .eq("id", id)
        .single();

    if (error || !file) {
        return NextResponse.json(
            { message: "파일 정보를 찾을 수 없습니다." },
            { status: 404 }
        );
    }

    const storagePath = file.storage_path || file.file_url;

    const { data, error: signedUrlError } = await supabase.storage
        .from(FILE_BUCKET)
        .createSignedUrl(storagePath, 60 * 5);

    if (signedUrlError || !data?.signedUrl) {
        return NextResponse.json(
            { message: "파일 열기 링크를 만들 수 없습니다." },
            { status: 500 }
        );
    }

    return NextResponse.redirect(data.signedUrl);
}