type Status =
	| "published"
	| "draft"
	| "featured"
	| "active"
	| "inactive"
	| "unread"
	| "read"
	| "replied"
	| "archived"
	| "expired"
	| "upcoming"
	| "done";

const STATUS_MAP: Record<Status, { label: string; className: string }> = {
	published: { label: "Published",   className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
	draft:     { label: "Draft",       className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300" },
	featured:  { label: "Featured",    className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
	active:    { label: "Aktif",       className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
	inactive:  { label: "Nonaktif",    className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300" },
	unread:    { label: "Belum Dibaca",className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
	read:      { label: "Dibaca",      className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
	replied:   { label: "Dibalas",     className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
	archived:  { label: "Diarsipkan",  className: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400" },
	expired:   { label: "Kadaluarsa",  className: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" },
	upcoming:  { label: "Akan Datang", className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
	done:      { label: "Selesai",     className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300" },
};

export function AdminStatusBadge({ status }: { status: Status }) {
	const config = STATUS_MAP[status] ?? STATUS_MAP.draft;
	return (
		<span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${config.className}`}>
			{config.label}
		</span>
	);
}
