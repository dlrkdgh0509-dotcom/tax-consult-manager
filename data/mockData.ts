import type { Customer, Consultation, Task } from "@/types";

export const customers: Customer[] = [
    {
        id: 1,
        name: "홍길동",
        phone: "010-1234-5678",
        taxType: "양도소득세",
        status: "검토중",
        memo: "1세대 1주택 비과세 상담",
        createdAt: "2026-06-01",
    },
    {
        id: 2,
        name: "김철수",
        phone: "010-2222-3333",
        taxType: "상속세",
        status: "자료요청",
        memo: "상속재산 목록 확인 필요",
        createdAt: "2026-06-01",
    },
];

export const consultations: Consultation[] = [
    {
        id: 1,
        customerId: 1,
        date: "2026-06-01",
        title: "양도세 상담",
        content: "거주주택 비과세 가능성 검토",
        fileUrl: "https://drive.google.com",
    },
    {
        id: 2,
        customerId: 2,
        date: "2026-06-01",
        title: "상속세 상담",
        content: "상속인 구성 및 재산목록 확인",
    },
];

export const tasks: Task[] = [
    {
        id: 1,
        customerName: "홍길동",
        title: "등기부등본 요청",
        dueDate: "2026-06-03",
        status: "미완료",
    },
    {
        id: 2,
        customerName: "김철수",
        title: "가족관계증명서 확인",
        dueDate: "2026-06-04",
        status: "미완료",
    },
];