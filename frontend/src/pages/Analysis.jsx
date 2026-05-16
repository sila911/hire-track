import AnalyticsSources from '../components/Analysis/AnalyticsSources';
import AnalyticsVelocity from '../components/Analysis/AnalyticsVelocity';
import AnalyticsConsistency from '../components/Analysis/AnalyticsConsistency';

export default function Analysis() {
  return (
    <div className="p-6 lg:p-10 space-y-8">
      <header className="mb-8">
        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
          Hiring Analytics
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-bold">
          Insights into your job search performance and lead sources.
        </p>
      </header>

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
