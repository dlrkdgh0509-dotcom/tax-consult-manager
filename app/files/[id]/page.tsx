import { redirect } from "next/navigation";

type FilePageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function FilePage({ params }: FilePageProps) {
    const { id } = await params;

    redirect(`/files/${id}/edit`);
}