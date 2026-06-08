import { expect, test } from "bun:test";

import packageJson from "../package.json";

test("declares the TanStack Table runtime dependency used by admin tables", () => {
	const runtimeDependencies = packageJson.dependencies ?? {};

	expect(runtimeDependencies).toHaveProperty("@tanstack/react-table");
});
