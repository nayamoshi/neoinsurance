import { CoverageWizard } from '@/components/create-coverage/coverage-wizard';

export default function CreateCoveragePage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create a New Coverage</h1>
        <p className="text-muted-foreground">
          Follow the steps to get your new asset protected.
        </p>
      </div>
      <CoverageWizard />
    </div>
  );
}
