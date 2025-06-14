const Error = ({ error, onRetry }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="m-auto text-center">
        <p className="text-red-500 text-lg">{error}</p>
        <button 
          onClick={onRetry}
          className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
        >
          Retry
        </button>
      </div>
    </div>
  );
};

export default Error;