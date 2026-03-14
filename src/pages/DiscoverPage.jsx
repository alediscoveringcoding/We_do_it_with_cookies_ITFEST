import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import supabase from '../api/supabaseClient';
import UniversityCard from '../components/UniversityCard';
import SwipeButtons from '../components/SwipeButtons';
import Nav from './Nav';

function DiscoverPage({ setActivePage }) {
  const { user } = useContext(AuthContext);
  const [universities, setUniversities] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [choices, setChoices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completed, setCompleted] = useState(false);

  // Fetch filtered universities and user's previous choices
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all universities
        const { data: allUniversities, error: fetchError } = await supabase
          .from('universities')
          .select('*')
          .order('id');

        if (fetchError) throw fetchError;

        // Fetch user's choices
        const { data: userChoices, error: choicesError } = await supabase
          .from('user_university_choices')
          .select('university_id, choice')
          .eq('user_id', user.id);

        if (choicesError) throw choicesError;

        // Build choices map
        const choicesMap = {};
        if (userChoices) {
          userChoices.forEach((c) => {
            choicesMap[c.university_id] = c.choice;
          });
        }
        setChoices(choicesMap);

        // Filter out already-decided universities
        const undecidedUniversities = allUniversities.filter(
          (u) => !choicesMap[u.id]
        );

        setUniversities(undecidedUniversities);
      } catch (err) {
        console.error('Error fetching universities:', err);
        setError('Failed to load universities. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUniversities();
    }
  }, [user]);

  // Save choice to Supabase and move to next
  const saveChoice = async (universityId, choice) => {
    try {
      const { error } = await supabase
        .from('user_university_choices')
        .upsert(
          {
            user_id: user.id,
            university_id: universityId,
            choice: choice,
          },
          { onConflict: 'user_id,university_id' }
        );

      if (error) throw error;

      // Update local state
      setChoices((prev) => ({
        ...prev,
        [universityId]: choice,
      }));

      // Move to next
      if (currentIndex + 1 < universities.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCompleted(true);
      }
    } catch (err) {
      console.error('Error saving choice:', err);
      setError('Failed to save your choice. Please try again.');
    }
  };

  const handleNo = () => {
    if (universities[currentIndex]) {
      saveChoice(universities[currentIndex].id, 'no');
    }
  };

  const handleYes = () => {
    if (universities[currentIndex]) {
      saveChoice(universities[currentIndex].id, 'yes');
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') {
        handleNo();
      } else if (e.key === 'ArrowRight') {
        handleYes();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, universities]);

  const currentUniversity = universities[currentIndex];
  const progressPercent = universities.length > 0
    ? ((currentIndex) / universities.length) * 100
    : 0;

  return (
    <div className="pf-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Nav activePage="discover" setActivePage={setActivePage} />

      {loading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin mb-4">⚙️</div>
            <p className="text-gray-600 text-lg">Loading universities...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-md w-full mx-4 p-6 bg-red-50 border-2 border-red-200 rounded-2xl text-center">
            <p className="text-red-700 font-semibold mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 rounded-full font-semibold"
              style={{ backgroundColor: 'var(--teal)', color: 'white' }}
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {!loading && !error && !completed && (
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-12" style={{ background: 'var(--bg)' }}>
          {/* Progress bar */}
          <div className="w-full max-w-2xl mb-8">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-semibold text-gray-600">
                {currentIndex + 1} of {universities.length}
              </p>
              <p className="text-xs text-gray-500">{Math.round(progressPercent)}% complete</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${progressPercent}%`,
                  backgroundColor: 'var(--teal)',
                }}
              />
            </div>
          </div>

          {/* Card */}
          {currentUniversity && (
            <div className="mb-8">
              <UniversityCard university={currentUniversity} isVisible={true} />
            </div>
          )}

          {/* Buttons */}
          <SwipeButtons onNo={handleNo} onYes={handleYes} disabled={!currentUniversity} />

          {/* Keyboard hint */}
          <p className="text-xs text-gray-500 mt-6 text-center">
            💡 Tip: Use ← and → arrow keys for quick swiping
          </p>
        </div>
      )}

      {!loading && !error && completed && (
        <div className="flex-1 flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
          <div className="max-w-md w-full text-center">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              You're All Caught Up!
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              You've reviewed all available universities. Check out your matches and start exploring your top choices!
            </p>
            <button
              onClick={() => setActivePage('my-matches')}
              className="w-full px-6 py-3 text-white rounded-full font-semibold text-lg transition-all duration-200"
              style={{ backgroundColor: 'var(--teal)' }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = 'var(--teal-light)')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = 'var(--teal)')}
            >
              See My Matches ✓
            </button>
            <button
              onClick={() => setActivePage('home')}
              className="w-full mt-3 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-semibold text-lg transition-all duration-200"
              onMouseEnter={(e) => {
                e.target.style.borderColor = 'var(--teal)';
                e.target.style.color = 'var(--teal)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.color = '#374151';
              }}
            >
              Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DiscoverPage;
