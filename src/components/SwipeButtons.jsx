function SwipeButtons({ onNo, onYes, disabled = false }) {
  return (
    <div className="flex gap-4 mt-8 justify-center">
      <button
        onClick={onNo}
        disabled={disabled}
        className="flex items-center justify-center gap-2 px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-semibold text-lg transition-all duration-200 hover:border-red-500 hover:text-red-500 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Not Interested (or press ← arrow)"
      >
        <span>✕</span>
        Not Interested
      </button>
      <button
        onClick={onYes}
        disabled={disabled}
        className="flex items-center justify-center gap-2 px-8 py-3 text-white rounded-full font-semibold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ backgroundColor: 'var(--teal)' }}
        onMouseEnter={(e) => !disabled && (e.target.style.backgroundColor = 'var(--teal-light)')}
        onMouseLeave={(e) => (e.target.style.backgroundColor = 'var(--teal)')}
        title="Interested (or press → arrow)"
      >
        <span>✓</span>
        Interested
      </button>
    </div>
  );
}

export default SwipeButtons;
