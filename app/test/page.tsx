import { supabase } from "@/lib/supabase";

export default async function TestPage() {
    const { data, error } = await supabase
        .from("customers")
        .select("*");

    return (
        <div style={{ padding: "40px" }}>
            <h1>DB 연결 테스트</h1>

            <pre>
                {JSON.stringify(
                    {
                        data,
                        error,
                    },
                    null,
                    2
                )}
            </pre>
        </div>
    );
}