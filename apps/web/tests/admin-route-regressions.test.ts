import { expect, test } from "bun:test";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as ts from "typescript";

const testDir = dirname(fileURLToPath(import.meta.url));
const adminRoutesDir = resolve(testDir, "../src/routes/admin");

const directInputKeys = new Set([
	"action",
	"category",
	"days",
	"entityType",
	"id",
	"isActive",
	"isPublished",
	"page",
	"perPage",
	"programSlug",
	"search",
	"status",
]);

function getFiles(dir: string): string[] {
	const files: string[] = [];

	for (const entry of readdirSync(dir)) {
		const fullPath = resolve(dir, entry);
		if (statSync(fullPath).isDirectory()) {
			files.push(...getFiles(fullPath));
			continue;
		}

		if (fullPath.endsWith(".tsx") || fullPath.endsWith(".ts")) {
			files.push(fullPath);
		}
	}

	return files;
}

function getPropertyName(name: ts.PropertyName): string | null {
	if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) {
		return name.text;
	}

	return null;
}

function getDirectInputKeys(object: ts.ObjectLiteralExpression) {
	const keys: string[] = [];

	for (const property of object.properties) {
		if (ts.isPropertyAssignment(property) || ts.isShorthandPropertyAssignment(property)) {
			const key = getPropertyName(property.name);
			if (key && directInputKeys.has(key)) {
				keys.push(key);
			}
		}
	}

	return keys;
}

function hasInputWrapper(object: ts.ObjectLiteralExpression) {
	return object.properties.some((property) => {
		if (!ts.isPropertyAssignment(property) && !ts.isShorthandPropertyAssignment(property)) {
			return false;
		}

		return getPropertyName(property.name) === "input";
	});
}

test("admin oRPC queryOptions wrap procedure input under the input key", () => {
	const failures: string[] = [];

	for (const filePath of getFiles(adminRoutesDir)) {
		const sourceText = readFileSync(filePath, "utf8");
		const sourceFile = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

		function visit(node: ts.Node) {
			if (
				ts.isCallExpression(node) &&
				ts.isPropertyAccessExpression(node.expression) &&
				node.expression.name.text === "queryOptions"
			) {
				const [argument] = node.arguments;
				if (argument && ts.isObjectLiteralExpression(argument) && !hasInputWrapper(argument)) {
					const keys = getDirectInputKeys(argument);
					if (keys.length > 0) {
						const position = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
						failures.push(
							`${relative(process.cwd(), filePath)}:${position.line + 1}:${position.character + 1} uses direct queryOptions keys: ${keys.join(", ")}`,
						);
					}
				}
			}

			ts.forEachChild(node, visit);
		}

		visit(sourceFile);
	}

	expect(failures).toEqual([]);
});

test("admin root route calls route hooks before returning the login outlet", () => {
	const source = readFileSync(resolve(adminRoutesDir, "route.tsx"), "utf8");
	const loginOutletReturn = source.indexOf("return <Outlet />;");
	const routeContextHook = source.indexOf("Route.useRouteContext()");
	const loaderDataHook = source.indexOf("Route.useLoaderData()");

	expect(routeContextHook).toBeGreaterThan(-1);
	expect(loaderDataHook).toBeGreaterThan(-1);
	expect(routeContextHook).toBeLessThan(loginOutletReturn);
	expect(loaderDataHook).toBeLessThan(loginOutletReturn);
});
