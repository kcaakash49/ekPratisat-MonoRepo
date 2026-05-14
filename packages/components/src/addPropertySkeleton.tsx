

export const AddPropertySkeleton = () => {
  return (
    <div className="ek-form-shell animate-pulse">
      {/* Header Skeleton */}
      <div className="mb-6 h-8 w-48 rounded bg-[rgba(154,106,0,0.12)] dark:bg-[rgba(229,184,62,0.1)]" />

      <div className="space-y-6">
        {/* Title Field Skeleton */}
        <div className="space-y-2">
          <div className="h-4 w-12 rounded bg-[rgba(154,106,0,0.12)] dark:bg-[rgba(229,184,62,0.1)]" />
          <div className="h-10 w-full rounded-xl bg-[rgba(154,106,0,0.07)] dark:bg-[rgba(229,184,62,0.07)]" />
        </div>

        {/* Description Field Skeleton */}
        <div className="space-y-2">
          <div className="h-4 w-20 rounded bg-[rgba(154,106,0,0.12)] dark:bg-[rgba(229,184,62,0.1)]" />
          <div className="h-24 w-full rounded-xl bg-[rgba(154,106,0,0.07)] dark:bg-[rgba(229,184,62,0.07)]" />
        </div>

        {/* Type & Category Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="h-4 w-12 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-10 w-full bg-gray-100 dark:bg-gray-800/50 rounded-md" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-10 w-full bg-gray-100 dark:bg-gray-800/50 rounded-md" />
          </div>
        </div>

        {/* Price Field Skeleton */}
        <div className="space-y-2">
          <div className="h-4 w-12 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-10 w-full bg-gray-100 dark:bg-gray-800/50 rounded-md" />
        </div>

        {/* Location Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded" />
              <div className="h-10 w-full bg-gray-100 dark:bg-gray-800/50 rounded-md" />
            </div>
          ))}
        </div>

        {/* Map Container Skeleton */}
        <div className="space-y-2">
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-[320px] w-full bg-gray-100 dark:bg-gray-800/40 rounded-md" />
          <div className="grid grid-cols-2 gap-2 mt-2">
             <div className="h-14 bg-gray-50 dark:bg-gray-800/30 rounded" />
             <div className="h-14 bg-gray-50 dark:bg-gray-800/30 rounded" />
          </div>
        </div>

        {/* Image Upload Area Skeleton */}
        <div className="space-y-2">
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="flex gap-4 items-center">
            <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded-md" />
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 w-20 bg-gray-100 dark:bg-gray-800 rounded border border-dashed border-gray-300 dark:border-gray-700" />
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button Skeleton */}
        <div className="h-12 w-full bg-yellow-600/20 dark:bg-yellow-600/10 rounded-md mt-6" />
      </div>
    </div>
  );
};
