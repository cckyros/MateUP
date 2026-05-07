const fs = require('fs');
const path = require('path');

const files = [
  'src/App.tsx',
  'src/components/OrderRating.tsx',
  'src/pages/ApplyPlayerPage.tsx',
  'src/pages/ApplyStatusPage.tsx',
  'src/pages/ChatPage.tsx',
  'src/pages/CoverPage.tsx',
  'src/pages/LoginPage.tsx',
  'src/pages/NotificationPage.tsx',
  'src/pages/OrderDetailPage.tsx',
  'src/pages/OrdersPage.tsx',
  'src/pages/PaymentPage.tsx',
  'src/pages/PlayerDetailPage.tsx',
  'src/pages/PlayerEarningsPage.tsx',
  'src/pages/PlayerHomePage.tsx',
  'src/pages/PlayerListPage.tsx',
  'src/pages/PlayerOrdersPage.tsx',
  'src/pages/PlayerProfilePage.tsx',
  'src/pages/PlayerReviewsPage.tsx',
  'src/pages/ProfilePage.tsx',
  'src/pages/SearchPage.tsx',
  'src/pages/SettingsPage.tsx',
];

function addAsAnyToStyleObjects(content) {
  let result = '';
  let i = 0;
  
  while (i < content.length) {
    const styleStart = content.indexOf('style={', i);
    if (styleStart === -1) {
      result += content.slice(i);
      break;
    }
    
    result += content.slice(i, styleStart + 7);
    i = styleStart + 7;
    
    while (i < content.length && (content[i] === ' ' || content[i] === '\t' || content[i] === '\n' || content[i] === '\r')) {
      result += content[i];
      i++;
    }
    
    if (content[i] !== '{') continue;
    
    let braceCount = 1;
    let j = i + 1;
    while (j < content.length && braceCount > 0) {
      if (content[j] === '{') braceCount++;
      else if (content[j] === '}') braceCount--;
      j++;
    }
    
    result += content.slice(i, j);
    i = j;
    
    let checkPos = j;
    while (checkPos < content.length && (content[checkPos] === ' ' || content[checkPos] === '\t')) checkPos++;
    if (content.slice(checkPos, checkPos + 7) === ' as any') continue;
    
    result += ' as any';
  }
  
  return result;
}

function processFile(filePath) {
  const fullPath = path.join(__dirname, filePath);
  if (!fs.existsSync(fullPath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  let content = fs.readFileSync(fullPath, 'utf-8');
  const newContent = addAsAnyToStyleObjects(content);
  if (content !== newContent) {
    fs.writeFileSync(fullPath, newContent, 'utf-8');
    console.log(`Fixed: ${filePath}`);
  } else {
    console.log(`No changes: ${filePath}`);
  }
}

files.forEach(f => processFile(f));
console.log('Done!');
