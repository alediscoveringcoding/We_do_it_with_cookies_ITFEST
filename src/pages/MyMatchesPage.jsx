import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import supabase from '../api/supabaseClient';
import Nav from './Nav';

function MyMatchesPage({ setActivePage }) {
  const { user } = useContext(AuthContext);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user's YES universities
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('user_university_choices')
          .select('university_id, universities(*)')
          .eq('user_id', user.id)
          .eq('choice', 'yes');

        if (fetchError) throw fetchError;

        // Extract universities from the nested data
        const universities = data.map((item) => item.universities);
        setMatches(universities);
      } catch (err) {
        console.error('Error fetching matches:', err);
        setError('Failed to load your matches. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMatches();
    }
  }, [user]);

  const removeMatch = async (universityId) => {
    try {
      const { error: removeError } = await supabase
        .from('user_university_choices')
        .update({ choice: 'no' })
        .eq('user_id', user.id)
        .eq('university_id', universityId);

      if (removeError) throw removeError;

      // Update local state
      setMatches((prev) => prev.filter((u) => u.id !== universityId));
    } catch (err) {
      console.error('Error removing match:', err);
      setError('Failed to remove match. Please try again.');
    }
  };

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

  if (loading) {
    return (
      <div className="pf-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Nav activePage="my-matches" setActivePage={setActivePage} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin mb-4">⚙️</div>
            <p className="text-gray-600 text-lg">Loading your matches...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pf-page" style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Nav activePage="my-matches" setActivePage={setActivePage} />

      <div className="pf-section">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Your University Shortlist 🎓
            </h1>
            <p className="text-gray-600 text-lg">
              {matches.length === 0
                ? "You haven't liked any universities yet."
                : `${matches.length} ${matches.length === 1 ? 'university' : 'universities'} you're interested in`}
            </p>
          </div>

          {error && (
            <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 border-2 border-red-200 rounded-2xl text-red-700 font-semibold text-center">
              {error}
            </div>
          )}

          {matches.length === 0 ? (
            <div className="max-w-md mx-auto text-center">
              <div className="text-6xl mb-6">📚</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">No Matches Yet</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                You haven't liked any universities yet. Start discovering your perfect match!
              </p>
              <button
                onClick={() => setActivePage('discover')}
                className="px-6 py-3 text-white rounded-full font-semibold text-lg transition-all duration-200"
                style={{ backgroundColor: 'var(--teal)' }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = 'var(--teal-light)')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = 'var(--teal)')}
              >
                Start Discovering
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map((university) => (
                <div
                  key={university.id}
                  className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200"
                >
                  {/* Header */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {university.name}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <span className="font-semibold">{university.city}</span>
                      <span className="text-gray-400">·</span>
                      <span
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: 'var(--teal-pale)', color: 'var(--teal)' }}
                      >
                        {university.type}
                      </span>
                    </div>
                  </div>

                  {/* RIASEC Tags */}
                  <div className="mb-4">
                    <p className="text-xs uppercase font-semibold text-gray-500 mb-2 tracking-wider">Traits</p>
                    <div className="flex flex-wrap gap-1">
                      {university.riasec_tags.map((trait) => {
                        const { bg, text } = getRiasecColor(trait);
                        return (
                          <span key={trait} className={`${bg} ${text} px-2 py-1 rounded text-xs font-semibold`}>
                            {trait}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 text-sm mb-4 line-clamp-2">{university.description}</p>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeMatch(university.id)}
                    className="w-full py-2 border-2 border-gray-300 text-gray-700 rounded-full font-semibold text-sm transition-all duration-200 hover:border-red-500 hover:text-red-500 hover:bg-red-50"
                  >
                    Remove from Shortlist
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyMatchesPage;
