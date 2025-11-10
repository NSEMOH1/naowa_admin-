import * as XLSX from "xlsx";

interface ColumnConfig {
    key: string;
    header: string;
    width?: number;
    type?: "date" | "currency" | "number" | "text";
    format?: string;
}

interface ExportConfig {
    data: any[];
    columns: ColumnConfig[];
    filename?: string;
    sheetName?: string;
    title?: string;
}

export const exportToExcel = ({
    data,
    columns,
    filename = `export_${new Date().toISOString().split("T")[0]}.xlsx`,
    sheetName = "Sheet1",
    title,
}: ExportConfig) => {
    if (!data || data.length === 0) {
        console.warn("No data provided for Excel export");
        return;
    }
    const transformedData = data.map((row) => {
        const newRow: any = {};

        columns.forEach((col) => {
            let value = row[col.key];
            switch (col.type) {
                case "date":
                    if (value) {
                        value = new Date(value).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        });
                    }
                    break;

                case "currency":
                    if (typeof value === "number") {
                        value = parseFloat(value.toString());
                    }
                    break;

                case "number":
                    if (value !== null && value !== undefined) {
                        value = parseFloat(value.toString()) || 0;
                    }
                    break;

                default:
                    if (value === null || value === undefined) {
                        value = "N/A";
                    }
            }

            newRow[col.header] = value;
        });

        return newRow;
    });

    const workbook = XLSX.utils.book_new();
    let worksheet: XLSX.WorkSheet;

    if (title) {
        const titleData = [{ [columns[0].header]: title }];
        const emptyRow = [{}];
        const allData = [...titleData, ...emptyRow, ...transformedData];
        worksheet = XLSX.utils.json_to_sheet(allData, { skipHeader: false });

        const titleRange = XLSX.utils.encode_range({
            s: { c: 0, r: 0 },
            e: { c: columns.length - 1, r: 0 },
        });
        worksheet["!merges"] = [XLSX.utils.decode_range(titleRange)];

        worksheet["A1"].s = {
            font: { bold: true, sz: 14 },
            alignment: { horizontal: "center" },
        };
    } else {
        worksheet = XLSX.utils.json_to_sheet(transformedData);
    }
    worksheet["!cols"] = columns.map((col) => ({
        width: col.width || 15,
    }));

    if (worksheet["!ref"]) {
        const range = XLSX.utils.decode_range(worksheet["!ref"]);
        const filterStartRow = title ? 2 : 0;
        const filterRange = XLSX.utils.encode_range({
            s: { c: 0, r: filterStartRow },
            e: { c: columns.length - 1, r: range.e.r },
        });
        worksheet["!autofilter"] = { ref: filterRange };
    }

    const freezeRow = title ? 3 : 1;
    worksheet["!freeze"] = { xSplit: 0, ySplit: freezeRow };

    const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");
    const dataStartRow = title ? 2 : 1;

    columns.forEach((col, colIndex) => {
        if (col.type === "currency" || col.type === "number" || col.format) {
            for (let row = dataStartRow; row <= range.e.r; row++) {
                const cellAddress = XLSX.utils.encode_cell({
                    r: row,
                    c: colIndex,
                });
                if (
                    worksheet[cellAddress] &&
                    typeof worksheet[cellAddress].v === "number"
                ) {
                    if (col.format) {
                        worksheet[cellAddress].z = col.format;
                    } else if (col.type === "currency") {
                        worksheet[cellAddress].z = "#,##0.00";
                    } else if (col.type === "number") {
                        worksheet[cellAddress].z = "#,##0";
                    }
                }
            }
        }
    });
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, filename);
};

export const quickExportToExcel = (
    data: any[],
    filename?: string,
    autoDetectTypes: boolean = true
) => {
    if (!data || data.length === 0) return;

    const firstItem = data[0];
    const columns: ColumnConfig[] = Object.keys(firstItem).map((key) => {
        const value = firstItem[key];
        let type: ColumnConfig["type"] = "text";

        if (autoDetectTypes) {
            if (
                key.toLowerCase().includes("date") ||
                key.toLowerCase().includes("time")
            ) {
                type = "date";
            } else if (
                key.toLowerCase().includes("amount") ||
                key.toLowerCase().includes("price") ||
                key.toLowerCase().includes("cost")
            ) {
                type = "currency";
            } else if (typeof value === "number") {
                type = "number";
            }
        }
        return {
            key,
            header:
                key.charAt(0).toUpperCase() +
                key.slice(1).replace(/([A-Z])/g, " $1"),
            type,
            width: 15,
        };
    });

    exportToExcel({
        data,
        columns,
        filename,
    });
};
