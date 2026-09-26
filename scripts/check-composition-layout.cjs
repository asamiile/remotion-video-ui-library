// Guard the Studio folder limit across every registration file.
const fs = require('node:fs');
const assert = require('node:assert/strict');
const ts = require('typescript');
let count = 0, maximum = 0;
for (const file of fs.readdirSync('src').filter((f) => /^root.*\.tsx$/.test(f))) {
  const source = ts.createSourceFile(file, fs.readFileSync(`src/${file}`, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  function visit(node, folders = []) {
    if (ts.isJsxElement(node) && node.openingElement.tagName.getText(source) === 'Folder') {
      const attr = node.openingElement.attributes.properties.find((a) => a.name?.getText(source) === 'name');
      folders = [...folders, attr.initializer.text];
      assert(folders.length <= 3, `${file}: ${folders.join('/')}`);
      maximum = Math.max(maximum, folders.length);
      count++;
    }
    ts.forEachChild(node, (child) => visit(child, folders));
  }
  visit(source);
}
const outputs = [...fs.readFileSync('render.sh', 'utf8').matchAll(/echo "((?:Effect|Text|Background|UI|Motion|Logo|Audio|Map|Loading|Intro|Placeholder)\/[^"$]+)"/g)];
for (const [, output] of outputs) assert(output.split('/').length <= 3, `Output too deep: ${output}`);
console.log(`${count} Studio folders checked; maximum depth ${maximum}; ${outputs.length} output mappings checked`);
