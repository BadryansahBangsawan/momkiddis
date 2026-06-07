import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
	type RowSelectionState,
} from "@tanstack/react-table";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@momkiddis/ui/components/table";
import { Button } from "@momkiddis/ui/components/button";
import { Input } from "@momkiddis/ui/components/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@momkiddis/ui/components/select";
import { Skeleton } from "@momkiddis/ui/components/skeleton";
import { ChevronLeft, ChevronRight, Download, Plus, Search } from "lucide-react";
import { AdminEmptyState } from "./admin-empty-state";
import { AdminBulkToolbar } from "./admin-bulk-toolbar";
import { useState } from "react";

interface FilterConfig {
	key: string;
	label: string;
	options: { label: string; value: string }[];
}

interface BulkAction {
	label: string;
	action: string;
	variant?: "default" | "destructive" | "outline";
}

interface AdminDataTableProps<T> {
	columns: ColumnDef<T>[];
	data: T[];
	isLoading?: boolean;
	searchPlaceholder?: string;
	searchValue?: string;
	onSearchChange?: (value: string) => void;
	filters?: FilterConfig[];
	filterValues?: Record<string, string>;
	onFilterChange?: (key: string, value: string) => void;
	enableBulkSelect?: boolean;
	bulkActions?: BulkAction[];
	onBulkAction?: (action: string, ids: string[]) => void;
	onAdd?: () => void;
	addLabel?: string;
	onExport?: () => void;
	emptyTitle?: string;
	emptyDescription?: string;
	// Pagination
	page?: number;
	perPage?: number;
	total?: number;
	onPageChange?: (page: number) => void;
}

export function AdminDataTable<T extends { id: string }>({
	columns,
	data,
	isLoading,
	searchPlaceholder = "Cari...",
	searchValue,
	onSearchChange,
	filters,
	filterValues,
	onFilterChange,
	enableBulkSelect,
	bulkActions = [],
	onBulkAction,
	onAdd,
	addLabel = "Tambah",
	onExport,
	emptyTitle = "Belum ada data",
	emptyDescription,
	page = 1,
	perPage = 10,
	total = 0,
	onPageChange,
}: AdminDataTableProps<T>) {
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

	const selectionColumn: ColumnDef<T> = {
		id: "select",
		header: ({ table }) => (
			<input
				type="checkbox"
				checked={table.getIsAllPageRowsSelected()}
				onChange={table.getToggleAllPageRowsSelectedHandler()}
				className="cursor-pointer"
			/>
		),
		cell: ({ row }) => (
			<input
				type="checkbox"
				checked={row.getIsSelected()}
				onChange={row.getToggleSelectedHandler()}
				className="cursor-pointer"
			/>
		),
		size: 40,
	};

	const allColumns = enableBulkSelect ? [selectionColumn, ...columns] : columns;

	const table = useReactTable({
		data,
		columns: allColumns,
		getCoreRowModel: getCoreRowModel(),
		state: { rowSelection },
		onRowSelectionChange: setRowSelection,
		getRowId: (row) => row.id,
	});

	const selectedIds = Object.keys(rowSelection).filter((id) => rowSelection[id]);
	const totalPages = Math.ceil(total / perPage);

	return (
		<div className="flex flex-col gap-4">
			{/* Toolbar */}
			<div className="flex flex-wrap items-center gap-3">
				{onSearchChange && (
					<div className="relative flex-1 min-w-[200px] max-w-sm">
						<Search className="text-muted-foreground absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2" />
						<Input
							placeholder={searchPlaceholder}
							value={searchValue}
							onChange={(e) => onSearchChange(e.target.value)}
							className="pl-9"
						/>
					</div>
				)}
				{filters?.map((filter) => (
					<Select
						key={filter.key}
						value={filterValues?.[filter.key] ?? ""}
						onValueChange={(val) => onFilterChange?.(filter.key, val)}
					>
						<SelectTrigger className="w-[160px]">
							<SelectValue placeholder={filter.label} />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="">Semua {filter.label}</SelectItem>
							{filter.options.map((opt) => (
								<SelectItem key={opt.value} value={opt.value}>
									{opt.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				))}
				<div className="ml-auto flex gap-2">
					{onExport && (
						<Button variant="outline" size="sm" onClick={onExport}>
							<Download className="mr-2 h-4 w-4" />
							Export CSV
						</Button>
					)}
					{onAdd && (
						<Button size="sm" onClick={onAdd}>
							<Plus className="mr-2 h-4 w-4" />
							{addLabel}
						</Button>
					)}
				</div>
			</div>

			{/* Bulk toolbar */}
			{enableBulkSelect && selectedIds.length > 0 && (
				<AdminBulkToolbar
					selectedCount={selectedIds.length}
					actions={bulkActions}
					onAction={(action) => onBulkAction?.(action, selectedIds)}
					onClear={() => setRowSelection({})}
				/>
			)}

			{/* Table */}
			<div className="rounded-lg border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id} style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}>
										{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{isLoading ? (
							Array.from({ length: perPage }).map((_, i) => (
								<TableRow key={i}>
									{allColumns.map((_, j) => (
										<TableCell key={j}>
											<Skeleton className="h-4 w-full" />
										</TableCell>
									))}
								</TableRow>
							))
						) : table.getRowModel().rows.length === 0 ? (
							<TableRow>
								<TableCell colSpan={allColumns.length}>
									<AdminEmptyState title={emptyTitle} description={emptyDescription} />
								</TableCell>
							</TableRow>
						) : (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination */}
			{totalPages > 1 && (
				<div className="flex items-center justify-between text-sm">
					<p className="text-muted-foreground">
						{total} data total, halaman {page} dari {totalPages}
					</p>
					<div className="flex gap-2">
						<Button
							variant="outline"
							size="sm"
							disabled={page <= 1}
							onClick={() => onPageChange?.(page - 1)}
						>
							<ChevronLeft className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							size="sm"
							disabled={page >= totalPages}
							onClick={() => onPageChange?.(page + 1)}
						>
							<ChevronRight className="h-4 w-4" />
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
