const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-patron-gray-200 rounded ${className}`} />
);

// A row shaped like a transaction/product list item: thumbnail + two text lines + trailing amount.
export const SkeletonRow = () => (
  <div className="flex items-center gap-4 py-3">
    <Skeleton className="w-12 h-12 rounded-lg shrink-0" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-3.5 w-1/3" />
      <Skeleton className="h-3 w-1/4" />
    </div>
    <Skeleton className="h-4 w-16 shrink-0" />
  </div>
);

export const SkeletonRows = ({ count = 4 }) => (
  <div className="divide-y divide-patron-gray-100">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonRow key={i} />
    ))}
  </div>
);

// A creator profile shell: avatar + name/bio lines + a row of post-card placeholders.
export const SkeletonProfile = () => (
  <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
    <div className="flex items-center gap-4">
      <Skeleton className="w-16 h-16 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-64" />
      </div>
    </div>
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="border border-patron-gray-100 rounded-2xl p-4 space-y-3">
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      ))}
    </div>
  </div>
);

export default Skeleton;
