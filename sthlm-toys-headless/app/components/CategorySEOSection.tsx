import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CategorySEOSectionProps {
  title?: string;
  content?: string;
  defaultExpanded?: boolean;
}

export function CategorySEOSection({
  title,
  content,
  defaultExpanded = false,
}: CategorySEOSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  if (!title && !content) return null;

  const displayTitle = title || 'About This Category';
  const displayContent = content || 'Category information and details will be displayed here.';

  return (
    <section className="w-full bg-white border-t border-gray-200">
      <div className="mx-auto" style={{ width: '1272px', maxWidth: '100%', paddingLeft: '12px', paddingRight: '12px', paddingTop: '32px', paddingBottom: '32px' }}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between py-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
          aria-expanded={isExpanded}
        >
          <h2 className="text-gray-900 font-semibold" style={{ fontSize: '20px', fontWeight: 600, lineHeight: '24px', fontFamily: "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif" }}>
            {displayTitle}
          </h2>
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="pb-4">
            <div className="text-gray-700 prose prose-gray max-w-none" style={{ fontSize: '16px', lineHeight: '24px', fontFamily: "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif" }} dangerouslySetInnerHTML={{ __html: displayContent }} />
          </div>
        </div>
      </div>
    </section>
  );
}
