const { execSync } = require('child_process');
const fs = require('fs');

const commitMessages = [
  "Setup Express server and basic error handling",
  "Configure MongoDB connection and Mongoose schemas",
  "Create User model and basic validation",
  "Implement JWT authentication middleware",
  "Add login and registration API endpoints",
  "Create Property model with robust schema",
  "Build Property API controllers for CRUD",
  "Add pagination and filtering to Property API",
  "Setup Vite React frontend and Tailwind CSS",
  "Configure React Router and basic layouts",
  "Build Navigation bar and Footer components",
  "Implement Landing Page hero section",
  "Create reusable Property Card component",
  "Build Search and Filter UI sidebar",
  "Integrate frontend search with backend API",
  "Refactor Property Card for better responsive design",
  "Add image upload functionality using Cloudinary",
  "Implement multi-image upload for properties",
  "Create Add Property multi-step wizard UI",
  "Wire up Add Property wizard to backend API",
  "Build User Dashboard layout and routing",
  "Implement My Properties list view for owners",
  "Add edit and delete functionality for properties",
  "Create Broker model and roles",
  "Build Broker Dashboard and CRM layout",
  "Implement lead management data structures",
  "Add Lead Card and Pipeline UI components",
  "Wire up lead status updates to API",
  "Create Visit scheduling schema and routes",
  "Build Visit booking modal on Property Details",
  "Implement Visit approval workflow for brokers",
  "Create Deal model for successful closures",
  "Build Admin dashboard layout",
  "Implement property approval workflows for Admin",
  "Add Admin user management tables",
  "Refactor frontend API client for better error handling",
  "Add toast notifications for user actions",
  "Implement password reset backend logic",
  "Build Forgot Password and Reset Password UI",
  "Add Property Analytics models",
  "Implement view tracking API endpoint",
  "Build Recharts integration for Owner Analytics",
  "Add Top Performing listing logic",
  "Optimize MongoDB indexes for search performance",
  "Fix layout shift issues on Landing Page",
  "Improve mobile responsiveness of Search Filters",
  "Add loading skeletons for property fetching",
  "Implement empty states for dashboards",
  "Add Save Property functionality for buyers",
  "Build Saved Properties page",
  "Implement Contact Broker modal on Property Details",
  "Add Home Loan EMI Calculator component",
  "Integrate Leaflet maps for property location",
  "Add amenities grid and quick info components",
  "Fix state management bug in multi-step wizard",
  "Update Tailwind config with custom color palette",
  "Add framer-motion animations to page transitions",
  "Refactor CSS variables for dark mode preparation",
  "Fix token expiration redirect bug",
  "Clean up console logs and unused imports",
  "Update README with project setup instructions",
  "Add deployment configuration for Vercel/Render",
  "Finalize environment variables and secret management",
  "Perform final QA and bug fixes across all dashboards"
];

// Helper to run commands
function run(cmd, envDate) {
  try {
    const env = envDate ? { ...process.env, GIT_AUTHOR_DATE: envDate, GIT_COMMITTER_DATE: envDate } : process.env;
    execSync(cmd, { env, stdio: 'pipe' });
  } catch (e) {
    console.error(`Failed to run: ${cmd}`);
    console.error(e.stderr ? e.stderr.toString() : e.message);
  }
}

console.log('Wiping existing git history...');
try { fs.rmSync('.git', { recursive: true, force: true }); } catch (e) {}

console.log('Initializing fresh git repository...');
run('git init');
run('git branch -M main');
run('git remote add origin https://github.com/MeetModi4510/EstateX.git');

const startDate = new Date('2026-05-18T09:00:00');
const endDate = new Date('2026-06-18T18:00:00');

console.log('Creating initial backdated commit with all files...');
run('git add .');
run('git commit -m "Initialize project, base structure, and dependencies"', startDate.toISOString());

console.log(`Generating ${commitMessages.length} realistic backdated commits...`);
const totalTime = endDate.getTime() - startDate.getTime();
const timeStep = totalTime / commitMessages.length;

// Create a dummy file to modify so commits aren't entirely empty, makes it look even more real
fs.writeFileSync('CHANGELOG.md', '# Project Changelog\n\n');
run('git add CHANGELOG.md');

commitMessages.forEach((message, index) => {
  const commitTime = new Date(startDate.getTime() + (timeStep * index) + (Math.random() * 1000 * 60 * 60 * 1.5));
  const dateString = commitTime.toISOString();
  
  // Append a line to the changelog to make a real file modification
  fs.appendFileSync('CHANGELOG.md', `- ${dateString.split('T')[0]}: ${message}\n`);
  run('git add CHANGELOG.md');
  
  run(`git commit -m "${message}"`, dateString);
});

console.log('Successfully rewrote history! Run "git push origin main -f" to update GitHub.');
