

type PageLoaderProps = {
  message?: string;
};

const PageLoader = ({ message = "Loading..." }: PageLoaderProps) => {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#FFFDF9] px-4">
      <div className="relative flex h-20 w-20 items-center justify-center">
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-orange-100 border-t-orange-500" />

        <span className="text-3xl">🍕</span>
      </div>

      <h2 className="mt-6 text-xl font-bold text-gray-900">
        PizzaHub
      </h2>

      <p className="mt-2 text-sm text-gray-500">
        {message}
      </p>
    </div>
  );
};

export default PageLoader;