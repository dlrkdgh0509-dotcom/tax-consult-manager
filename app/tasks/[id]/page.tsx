import { redirect } from "next/navigation";

type TaskPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function TaskPage({ params }: TaskPageProps) {
    const { id } = await params;

    redirect(`/tasks/${id}/edit`);
}