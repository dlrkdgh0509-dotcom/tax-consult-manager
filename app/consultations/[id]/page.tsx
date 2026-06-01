import { redirect } from "next/navigation";

type ConsultationPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function ConsultationPage({ params }: ConsultationPageProps) {
    const { id } = await params;

    redirect(`/consultations/${id}/edit`);
}