import AnalyticsSources from '../components/Analysis/AnalyticsSources';
import AnalyticsVelocity from '../components/Analysis/AnalyticsVelocity';
import AnalyticsConsistency from '../components/Analysis/AnalyticsConsistency';
import AnalyticsSummaryCards from '../components/Analysis/AnalyticsSummaryCards';

export default function Analysis() {
  return (
    <div className="p-0 space-y-8">
      <header className="mb-8 px-2 md:px-0">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
          Hiring Analytics
        </h1>
        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-bold">
          Insights into your job search performance and lead sources.
        </p>
      </header>

      <AnalyticsSummaryCards />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="xl:col-span-2">
          <AnalyticsSources />
        </div>
        <div>
          <AnalyticsVelocity />
        </div>
        <div>
          <AnalyticsConsistency />
        </div>
      </div>
    </div>
  );
}
