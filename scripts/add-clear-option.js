import fs from 'fs';

const filePath = '/vercel/share/v0-project/app/(dashboard)/express-estimate/new/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Replace all <SelectContent> that don't already have a Clear option
// Pattern: <SelectContent> followed by newline and whitespace, then either <SelectItem or {
const regex = /(<SelectContent>)\n(\s+)(?!<SelectItem value="">Clear)/g;

content = content.replace(regex, (match, selectContent, whitespace) => {
  return `${selectContent}\n${whitespace}<SelectItem value="">Clear</SelectItem>\n${whitespace}`;
});

fs.writeFileSync(filePath, content);
console.log('Done! Added Clear option to all SelectContent elements.');
