import { FaExclamationTriangle } from 'react-icons/fa';

/**
 * @param {{ messages: string[], title?: string }} props
 */
export default function FormErrorAlert({ messages, title }) {
  const list = (messages || []).filter(Boolean);
  if (list.length === 0) return null;

  return (
    <div
      role="alert"
      className="flex gap-3 rounded-lg border border-red-100 bg-red-50 p-4 text-red-800 shadow-sm"
    >
      <FaExclamationTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" aria-hidden />
      <div className="min-w-0 flex-1">
        {title && <p className="text-sm font-bold text-red-900">{title}</p>}
        <ul className={`${title ? 'mt-1' : ''} list-inside space-y-1 text-sm font-medium text-red-800`}>
          {list.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
