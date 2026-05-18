const fs = require('fs');
const path = require('path');

const UI_COMPONENTS = [
  'Button', 'Input', 'Textarea', 'Dropdown', 'Checkbox', 'RadioGroup', 
  'Modal', 'Drawer', 'Dialog', 'Toast', 'Alert', 'Badge', 'Tag', 
  'Avatar', 'Pagination', 'Tabs', 'Breadcrumbs', 'Accordion', 
  'Skeleton', 'EmptyState', 'ErrorState', 'ImagePlaceholder', 'SectionHeader'
];

const SHARED_COMPONENTS = [
  'PropertyCard', 'FeatureCard', 'SearchBar', 'FilterSidebar', 
  'StatisticCard', 'DashboardCard', 'ProfileCard'
];

const LAYOUT_COMPONENTS = ['Navbar', 'Footer', 'Sidebar', 'Topbar'];
const LAYOUTS = ['PublicLayout', 'DashboardLayout'];

const PAGES = [
  'LandingPage', 'SearchProperties', 'PropertyDetails', 
  'BuyerDashboard', 'SellerDashboard', 'AdminDashboard', 
  'AddProperty', 'EditProperty', 'MyProperties', 'SavedProperties', 
  'SavedSearches', 'Profile', 'Settings', 'Notifications', 'Messages', 
  'About', 'Contact', 'HelpCenter', 'FAQ', 'PrivacyPolicy', 
  'TermsConditions', 'NotFoundPage'
];

function createComponent(dir, name) {
  const dirPath = path.join(__dirname, '..', 'src', dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const filePath = path.join(dirPath, `${name}.tsx`);
  const content = `import React from 'react';
import { cn } from '../../utils/cn';

interface ${name}Props extends React.HTMLAttributes<HTMLDivElement> {}

export const ${name}: React.FC<${name}Props> = ({ className, ...props }) => {
  return (
    <div className={cn('p-4 border rounded-xl', className)} {...props}>
      ${name} Component
    </div>
  );
};
`;
  fs.writeFileSync(filePath, content);
}

function createPage(name) {
  const dirPath = path.join(__dirname, '..', 'src', 'pages');
  const filePath = path.join(dirPath, `${name}.tsx`);
  const content = `import React from 'react';

const ${name}: React.FC = () => {
  return (
    <div className="container-custom py-12 min-h-screen">
      <h1 className="text-3xl mb-6">${name.replace(/([A-Z])/g, ' $1').trim()}</h1>
      <p className="text-neutral-secondary">Content for ${name} goes here.</p>
    </div>
  );
};

export default ${name};
`;
  fs.writeFileSync(filePath, content);
}

function createLayout(name) {
  const dirPath = path.join(__dirname, '..', 'src', 'layouts');
  const filePath = path.join(dirPath, `${name}.tsx`);
  const content = `import React from 'react';
import { Outlet } from 'react-router-dom';

const ${name}: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-bg">
      {/* Add Topbar / Navbar here */}
      <main className="flex-1">
        <Outlet />
      </main>
      {/* Add Footer here */}
    </div>
  );
};

export default ${name};
`;
  fs.writeFileSync(filePath, content);
}

UI_COMPONENTS.forEach(c => createComponent('components/ui', c));
SHARED_COMPONENTS.forEach(c => createComponent('components/shared', c));
LAYOUT_COMPONENTS.forEach(c => createComponent('components/layout', c));
LAYOUTS.forEach(l => createLayout(l));
PAGES.forEach(p => createPage(p));

console.log('All files generated successfully.');
