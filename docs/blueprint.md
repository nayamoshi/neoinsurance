# **App Name**: NeoAsegura

## Core Features:

- Wallet Authentication: Enable users to connect existing wallets (Metamask, Zerion, Rainbow) or create new simulated wallets, storing wallet addresses and data securely in Firestore.
- Dashboard Overview: Display key performance indicators (KPIs) such as total collateral locked, active coverages, reputation score, and claims filed using responsive cards with icons.
- Coverage Creation Wizard: Implement a step-by-step flow (wizard) for users to create new coverages, including category selection, coverage details input, AI risk estimation (mock), collateral deposit, and evidence uploading.
- AI Risk Estimator (Mock): Simulate an AI tool that calculates coverage fees based on risk factors (duration, user activity score), displaying a suggested fee and total cost with a visual gauge.
- Reputation Management: Provide a reputation view displaying the user's overall score, breakdown of completed coverages, disputes, fair outcomes, average rating, and a trend chart of score changes.
- Data Storage in Firestore: Store user data, coverage details, and reputation metrics in Firestore collections.
- Mock Cloud Functions: Simulate backend logic with Cloud Functions to calculate coverage fees, upload evidence to Firebase Storage, and update user reputation scores.

## Style Guidelines:

- Primary color: Soft blue (#64B5F6) to convey trust and security.
- Background color: Light gray (#F5F5F5) to create a clean and minimal interface.
- Accent color: Green (#A5D6A7) for positive confirmations and highlights.
- Body and headline font: 'Inter' sans-serif for a modern, neutral look. 
- Code font: 'Source Code Pro' for displaying transaction hashes.
- Use icons from 'lucide-react' for a consistent and clean interface.
- Cards with rounded borders and soft shadows (rounded-2xl shadow-md).
- Subtle animations (framer-motion or transition-all) for a smooth user experience.