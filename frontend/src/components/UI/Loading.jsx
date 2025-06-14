const Loading = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="m-auto text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-lg">Loading inventory...</p>
      </div>
    </div>
  );
};

export default Loading;