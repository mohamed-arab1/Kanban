import { NextRequest, NextResponse } from "next/server";
import { getAllTasks, createTask } from "@/lib/store";

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;

    let result = getAllTasks();

    // Filter by column
    const column = searchParams.get("column");
    if (column) {
        result = result.filter((t) => t.column === column);
    }

    // Search by query
    const q = searchParams.get("q");
    if (q) {
        const lower = q.toLowerCase();
        result = result.filter(
            (t) =>
                t.title.toLowerCase().includes(lower) ||
                t.description.toLowerCase().includes(lower)
        );
    }

    // Pagination
    const page = parseInt(searchParams.get("_page") || "1", 10);
    const limit = parseInt(searchParams.get("_limit") || "100", 10);
    const start = (page - 1) * limit;
    const paged = result.slice(start, start + limit);

    return NextResponse.json(paged, {
        headers: {
            "X-Total-Count": String(result.length),
            "Access-Control-Expose-Headers": "X-Total-Count",
        },
    });
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const task = createTask(body);
    return NextResponse.json(task, { status: 201 });
}
