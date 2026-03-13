import { useState } from 'react'

export default function QuizCard({ question, answer, onAnswer, onNext, isLast }) {
  const [selectedValue, setSelectedValue] = useState(answer || '')

  const handleSelect = (value) => {
    setSelectedValue(value)
    onAnswer(question.id, value)
  }

  const handleNext = () => {
    if (selectedValue) {
      onNext()
    }
  }

  const options = [
    { value: 1, label: 'Strongly Disagree' },
    { value: 2, label: 'Disagree' },
    { value: 3, label: 'Neutral' },
    { value: 4, label: 'Agree' },
    { value: 5, label: 'Strongly Agree' }
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-800 mb-6">
          {question.text}
        </h2>
        
        <div className="space-y-3">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`w-full text-left p-4 rounded-lg border-2 transition ${
                selectedValue === option.value
                  ? 'border-teal-600 bg-teal-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                    selectedValue === option.value
                      ? 'border-teal-600'
                      : 'border-slate-300'
                  }`}
                >
                  {selectedValue === option.value && (
                    <div className="w-3 h-3 rounded-full bg-teal-600"></div>
                  )}
                </div>
                <span className={`${
                  selectedValue === option.value ? 'text-teal-700 font-medium' : 'text-slate-700'
                }`}>
                  {option.label}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-slate-500">
          Select your response to continue
        </div>
        <button
          onClick={handleNext}
          disabled={!selectedValue}
          className={`px-6 py-2.5 rounded-lg font-medium transition ${
            selectedValue
              ? 'bg-teal-600 hover:bg-teal-700 text-white'
              : 'bg-slate-200 text-slate-500 cursor-not-allowed'
          }`}
        >
          {isLast ? 'See Results' : 'Next'}
        </button>
      </div>
    </div>
  )
}
