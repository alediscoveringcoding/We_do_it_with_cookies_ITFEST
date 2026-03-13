import { useState } from 'react'
import { riasecQuestions } from '../data/riasecQuestions'

const SCALE_OPTIONS = [
  { value: 1, label: 'Strongly Disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly Agree' },
]

function AssessmentStepper() {
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState({})

  const currentIndex = step === 2 ? getCurrentQuestionIndex(answers) : null
  const currentQuestion =
    step === 2 ? riasecQuestions[currentIndex] : undefined

  function getCurrentQuestionIndex(existingAnswers) {
    const firstUnanswered = riasecQuestions.findIndex(
      (q) => existingAnswers[q.id] == null,
    )
    return firstUnanswered === -1 ? 0 : firstUnanswered
  }

  function handleStart() {
    setStep(2)
  }

  function handleAnswerChange(questionId, value) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  function handleNextQuestion() {
    const nextIndex = getCurrentQuestionIndex(answers)
    const isComplete = Object.keys(answers).length === riasecQuestions.length
    if (isComplete) {
      setStep(3)
    } else {
      const nextQuestion = riasecQuestions[nextIndex]
      if (nextQuestion && answers[nextQuestion.id] != null) {
        // already answered, skip ahead
        const afterNext = nextIndex + 1
        if (afterNext >= riasecQuestions.length) {
          setStep(3)
        }
      }
    }
  }

  function computeTraitScores() {
    const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }
    for (const question of riasecQuestions) {
      const answer = answers[question.id]
      if (typeof answer === 'number') {
        scores[question.trait] += answer
      }
    }
    return scores
  }

  function getTopTraits(scores) {
    return Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([trait]) => trait)
  }

  const scores = step === 3 ? computeTraitScores() : null
  const topTraits = scores ? getTopTraits(scores) : []

  return (
    <div>
      <ProgressBar currentStep={step} />

      {step === 1 && (
        <IntroStep onStart={handleStart} totalQuestions={riasecQuestions.length} />
      )}

      {step === 2 && currentQuestion && (
        <QuestionStep
          question={currentQuestion}
          questionNumber={currentIndex + 1}
          totalQuestions={riasecQuestions.length}
          value={answers[currentQuestion.id] ?? null}
          onChange={(value) => handleAnswerChange(currentQuestion.id, value)}
          onNext={handleNextQuestion}
        />
      )}

      {step === 3 && scores && (
        <ResultsStep scores={scores} topTraits={topTraits} />
      )}
    </div>
  )
}

function ProgressBar({ currentStep }) {
  const steps = ['Intro', 'Quiz', 'Results']

  return (
    <div
      style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1.5rem',
        alignItems: 'center',
      }}
    >
      {steps.map((label, index) => {
        const stepNumber = index + 1
        const isActive = currentStep === stepNumber
        const isCompleted = currentStep > stepNumber
        return (
          <div
            key={label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              flex: 1,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '999px',
                border: '2px solid #0f766e',
                backgroundColor: isActive || isCompleted ? '#0f766e' : '#fff',
                color: isActive || isCompleted ? '#fff' : '#0f766e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              {stepNumber}
            </div>
            <span style={{ fontSize: 14 }}>{label}</span>
            {index < steps.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: 2,
                  backgroundColor: isCompleted ? '#0f766e' : '#e5e7eb',
                }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

function IntroStep({ onStart, totalQuestions }) {
  return (
    <section>
      <h2>How the assessment works</h2>
      <p>
        This short RIASEC assessment asks about what you enjoy doing. Based on
        your answers, we will highlight the kinds of work environments and tasks
        that may fit you best.
      </p>
      <ul>
        <li>About {totalQuestions} quick statements</li>
        <li>Answer using a 5-point scale from Strongly Disagree to Strongly Agree</li>
        <li>No right or wrong answers — just be honest</li>
      </ul>
      <button style={{ marginTop: '1rem' }} onClick={onStart}>
        Start quiz
      </button>
    </section>
  )
}

function QuestionStep({
  question,
  questionNumber,
  totalQuestions,
  value,
  onChange,
  onNext,
}) {
  const isAnswered = typeof value === 'number'

  return (
    <section>
      <p>
        Question {questionNumber} of {totalQuestions}
      </p>
      <h2>{question.text}</h2>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          marginTop: '1rem',
        }}
      >
        {SCALE_OPTIONS.map((option) => (
          <label
            key={option.value}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
            }}
          >
            <input
              type="radio"
              name={`question-${question.id}`}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <span>
              {option.value} — {option.label}
            </span>
          </label>
        ))}
      </div>
      <button
        style={{ marginTop: '1.5rem' }}
        onClick={onNext}
        disabled={!isAnswered}
      >
        {questionNumber === totalQuestions ? 'See my results' : 'Next question'}
      </button>
    </section>
  )
}

function ResultsStep({ scores, topTraits }) {
  return (
    <section>
      <h2>Your RIASEC pattern</h2>
      <p>
        These results highlight the kinds of activities and environments you may
        enjoy most.
      </p>

      <div style={{ marginTop: '1rem' }}>
        <h3>Trait scores</h3>
        <ul>
          {Object.entries(scores).map(([trait, score]) => (
            <li key={trait}>
              <strong>{trait}</strong>: {score}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <h3>Top traits</h3>
        {topTraits.length === 0 ? (
          <p>No answers yet.</p>
        ) : (
          <p>
            Your top traits are:{' '}
            <strong>{topTraits.join(', ')}</strong>. In the full version of the
            app, this will be used to suggest specific careers.
          </p>
        )}
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <button>See my career matches (coming soon)</button>
      </div>
    </section>
  )
}

export default AssessmentStepper

