function UniversityCard({ university, isVisible = true }) {
  const getRiasecColor = (trait) => {
    const colors = {
      R: { bg: 'bg-blue-100', text: 'text-blue-700' },
      I: { bg: 'bg-purple-100', text: 'text-purple-700' },
      A: { bg: 'bg-pink-100', text: 'text-pink-700' },
      S: { bg: 'bg-green-100', text: 'text-green-700' },
      E: { bg: 'bg-orange-100', text: 'text-orange-700' },
      C: { bg: 'bg-gray-100', text: 'text-gray-700' }
    };
    return colors[trait] || colors.C;
  };

  const getRiasecName = (trait) => {
    const names = {
      R: 'Realistic',
      I: 'Investigative',
      A: 'Artistic',
      S: 'Social',
      E: 'Enterprising',
      C: 'Conventional'
    };
    return names[trait];
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-md w-full transition-all duration-300 transform ${
        isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
      }`}
      style={{ minHeight: '500px' }}
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
          {university.name}
        </h2>
        <div className="flex items-center gap-2 text-gray-600">
          <span className="font-semibold">{university.city}</span>
          <span className="text-gray-400">·</span>
          <span className="px-3 py-1 bg-teal-pale rounded-full text-sm font-medium" style={{ color: 'var(--teal)' }}>
            {university.type}
          </span>
        </div>
      </div>

      {/* RIASEC Tags */}
      <div className="mb-6">
        <p className="text-xs uppercase font-semibold text-gray-500 mb-3 tracking-wider">Matches your traits</p>
        <div className="flex flex-wrap gap-2">
          {university.riasec_tags.map((trait) => {
            const { bg, text } = getRiasecColor(trait);
            return (
              <span
                key={trait}
                className={`${bg} ${text} px-3 py-1 rounded-full text-xs font-semibold`}
                title={getRiasecName(trait)}
              >
                {trait}
              </span>
            );
          })}
        </div>
      </div>

      {/* Description */}
      <div className="mb-8">
        <p className="text-gray-700 leading-relaxed text-sm">
          {university.description}
        </p>
      </div>

      {/* Footer spacer */}
      <div className="flex-1" />
    </div>
  );
}

export default UniversityCard;
