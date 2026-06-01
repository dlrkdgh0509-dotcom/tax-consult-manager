export type Customer = {
    id: number;
    name: string;
    phone: string;
    taxType: string;
    status: string;
    memo: string;
    createdAt: string;
};

export type Consultation = {
    id: number;
    customerId: number;
    date: string;
    title: string;
    content: string;
    fileUrl?: string;
};

export type Task = {
    id: number;
    customerName: string;
    title: string;
    dueDate: string;
    status: "미완료" | "완료";
};