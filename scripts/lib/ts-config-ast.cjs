/**
 * *-config.ts から export const のオブジェクトキー配列 / オブジェクト配列の id を取り出す（render 列挙用）。
 */
const fs = require("node:fs");
const ts = require("typescript");

/** @param {string} patternId */
function capPattern(patternId) {
  return patternId.charAt(0).toUpperCase() + patternId.slice(1);
}

/**
 * @param {import("typescript").SourceFile} sf
 * @param {string} exportName
 * @returns {string[] | null}
 */
function extractObjectKeysFromExport(sf, exportName) {
  for (const stmt of sf.statements) {
    if (!ts.isVariableStatement(stmt)) {
      continue;
    }
    const exported =
      stmt.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) ??
      false;
    if (!exported) {
      continue;
    }
    for (const decl of stmt.declarationList.declarations) {
      if (!ts.isIdentifier(decl.name) || decl.name.text !== exportName) {
        continue;
      }
      const init = decl.initializer;
      if (!init || !ts.isObjectLiteralExpression(init)) {
        continue;
      }
      return init.properties
        .filter(ts.isPropertyAssignment)
        .map((p) => p.name)
        .filter((n) => n && ts.isIdentifier(n))
        .map((n) => n.text);
    }
  }
  return null;
}

/**
 * export const name = [ { id: "a", ... }, ... ]
 * @param {import("typescript").SourceFile} sf
 * @param {string} exportName
 * @param {string} idProperty
 * @returns {string[] | null}
 */
function extractStringIdsFromExportedArray(sf, exportName, idProperty = "id") {
  for (const stmt of sf.statements) {
    if (!ts.isVariableStatement(stmt)) {
      continue;
    }
    const exported =
      stmt.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) ??
      false;
    if (!exported) {
      continue;
    }
    for (const decl of stmt.declarationList.declarations) {
      if (!ts.isIdentifier(decl.name) || decl.name.text !== exportName) {
        continue;
      }
      const init = decl.initializer;
      if (!init || !ts.isArrayLiteralExpression(init)) {
        continue;
      }
      const out = [];
      for (const el of init.elements) {
        if (!ts.isObjectLiteralExpression(el)) {
          continue;
        }
        for (const prop of el.properties) {
          if (!ts.isPropertyAssignment(prop)) {
            continue;
          }
          if (!ts.isIdentifier(prop.name) || prop.name.text !== idProperty) {
            continue;
          }
          const pv = prop.initializer;
          if (pv && ts.isStringLiteral(pv)) {
            out.push(pv.text);
          }
        }
      }
      return out;
    }
  }
  return null;
}

/**
 * @param {string} absPath
 */
function readSourceFile(absPath) {
  const source = fs.readFileSync(absPath, "utf8");
  return ts.createSourceFile(
    absPath,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
}

/**
 * @param {string} absPath
 * @param {string} exportName
 */
function requirePatternKeys(absPath, exportName) {
  const sf = readSourceFile(absPath);
  const keys = extractObjectKeysFromExport(sf, exportName);
  if (!keys) {
    throw new Error(
      `export const ${exportName} が ${absPath} に見つかりません`,
    );
  }
  return keys;
}

/**
 * @param {string} absPath
 * @param {string} exportName
 */
function requireArrayStringIds(absPath, exportName, idProperty = "id") {
  const sf = readSourceFile(absPath);
  const ids = extractStringIdsFromExportedArray(sf, exportName, idProperty);
  if (!ids) {
    throw new Error(
      `export const ${exportName}（配列）が ${absPath} に見つかりません`,
    );
  }
  return ids;
}

module.exports = {
  capPattern,
  extractObjectKeysFromExport,
  extractStringIdsFromExportedArray,
  readSourceFile,
  requirePatternKeys,
  requireArrayStringIds,
};
