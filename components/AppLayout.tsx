import Link from "next/link";

type AppLayoutProps = {
    children: React.ReactNode;
};

const menuItems = [
    { label: "대시보드", href: "/" },
    { label: "고객관리", href: "/customers" },
    { label: "상담관리", href: "/consultations" },
    { label: "할일관리", href: "/tasks" },
];

export default function AppLayout({ children }: AppLayoutProps) {
    return (
        <main className="min-h-screen bg-gray-100 flex">
            <aside className="w-64 bg-white border-r border-gray-200 p-6">
                <h1 className="text-2xl font-bold mb-10 text-gray-900">
                    세무 상담
                </h1>

                <nav className="space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="block px-4 py-3 rounded-xl hover:bg-gray-100 font-medium text-gray-900"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </aside>

            <section className="flex-1 p-10">
                {children}
            </section>
        </main>
    );
}