export type Pokja4DataRow = Record<string, unknown>;

export interface MonthlyDataRow extends Pokja4DataRow {
    bulan: number;
    nama_bulan: string;
}

export function aggregateByMonth(
    rows: Pokja4DataRow[],
    fields: string[]
): MonthlyDataRow[] {
    const monthlyRows = new Map<number, MonthlyDataRow>();

    rows.forEach((row) => {
        const month = Number(row.bulan);
        if (!Number.isFinite(month) || month < 1 || month > 12) {
            return;
        }

        const monthlyRow: MonthlyDataRow = monthlyRows.get(month) || {
            bulan: month,
            nama_bulan: String(row.nama_bulan || `Bulan ${month}`),
        };
        if (!monthlyRows.has(month)) {
            fields.forEach((field) => {
                monthlyRow[field] = 0;
            });
        }

        fields.forEach((field) => {
            monthlyRow[field] =
                Number(monthlyRow[field] || 0) + Number(row[field] || 0);
        });
        monthlyRows.set(month, monthlyRow);
    });

    return Array.from(monthlyRows.values()).sort(
        (first, second) => first.bulan - second.bulan
    );
}

export function sumField(rows: Pokja4DataRow[], field: string): number {
    return rows.reduce(
        (total, row) => total + (Number(row[field]) || 0),
        0
    );
}

export function formatValue(value: unknown): string {
    if (typeof value === "number" || (typeof value === "string" && value !== "")) {
        const numericValue = Number(value);
        if (Number.isFinite(numericValue)) {
            return numericValue.toLocaleString("id-ID");
        }
    }

    return value === null || value === undefined || value === ""
        ? "0"
        : String(value);
}
