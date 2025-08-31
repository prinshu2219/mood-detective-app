import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useI18n } from '../hooks/useI18n'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Badge } from '../components/Badge'
import { Confetti } from '../components/Confetti'
import { toPng } from 'html-to-image'
import { DetectiveGuide } from '../components/DetectiveGuide'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { getSessionId } from '../session'

const certificateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters'),
})

const feedbackSchema = z.object({
  emojiRating: z.number().min(1).max(5),
  comment: z.string().max(1000).optional(),
  category: z.enum(['game', 'ui', 'content', 'general']).default('general'),
  helpful: z.boolean().default(true),
})

type CertificateForm = z.infer<typeof certificateSchema>
type FeedbackForm = z.infer<typeof feedbackSchema>

export default function Certificate() {
  const { t, direction } = useI18n();
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  
  const {
    register: registerCertificate,
    handleSubmit: handleCertificateSubmit,
    formState: { errors: certificateErrors },
  } = useForm<CertificateForm>({
    resolver: zodResolver(certificateSchema),
  })

  const {
    register: registerFeedback,
    handleSubmit: handleFeedbackSubmit,
    formState: { errors: feedbackErrors },
  } = useForm<FeedbackForm>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      emojiRating: 5,
      category: 'general',
      helpful: true,
    },
  })

  const downloadCertificate = async (data: CertificateForm) => {
    const element = document.getElementById('certificate')
    if (!element) return

    // Show confetti celebration
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)

    try {
      // PDF only
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
      })
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' })
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = pageWidth - 48
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      const marginTop = (pageHeight - imgHeight) / 2
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 24, Math.max(24, marginTop), imgWidth, imgHeight)
      pdf.save(`mood-detective-certificate-${data.name}.pdf`)
    } catch (error) {
      console.error('Failed to generate certificate:', error)
      alert('Failed to generate certificate. Please try again.')
    }
  }

  const submitFeedback = async (data: FeedbackForm) => {
    try {
      const sessionId = getSessionId()
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': sessionId,
        },
        body: JSON.stringify({
          sessionId,
          ...data,
        }),
      })

      if (response.ok) {
        setFeedbackSubmitted(true)
        setShowFeedback(false)
      } else {
        console.error('Failed to submit feedback')
      }
    } catch (error) {
      console.error('Error submitting feedback:', error)
    }
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8"
      dir={direction}
    >
      <Confetti isActive={showConfetti} />
      
      <div className="max-w-4xl mx-auto px-4">
        <DetectiveGuide
          storageKey="guide-certificate"
          title="Great Job, Junior Mood Detective!"
          steps={[
            { text: 'Enter your name and download your certificate.' },
            { text: 'You can save PNG or PDF (good for printing).' },
            { text: 'Want to play more? Go back to the game!' },
          ]}
          primary={{ label: 'Okay!', onClick: () => {} }}
          secondary={{ label: 'Play Again', to: '/game' }}
        />
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-700 mb-4">
            {t('certificate.title')}
          </h1>
          <p className="text-gray-600">
            {t('certificate.subtitle')}
          </p>
        </div>

        <form onSubmit={handleCertificateSubmit(downloadCertificate)} className="mb-8">
          <div className="max-w-md mx-auto">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Your Name
            </label>
            <input
              {...registerCertificate('name')}
              type="text"
              id="name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter your name"
            />
            {certificateErrors.name && (
              <p className="mt-1 text-sm text-red-600">{certificateErrors.name.message}</p>
            )}
            <Button
              type="submit"
              variant="sky"
              size="lg"
              className="w-full mt-4"
            >
              Download Certificate
            </Button>
          </div>
        </form>

        <div
          id="certificate"
          className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto mb-8"
          style={{ aspectRatio: '1.414' }}
        >
          <div className="text-center h-full flex flex-col justify-center">
            <h2 className="text-4xl font-bold text-indigo-700 mb-4">
              {t('certificate.title')}
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              {t('certificate.achievement')}
            </p>
            
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {t('certificate.skills')}
              </h3>
              <ul className="text-left space-y-2 text-gray-700">
                <li>{t('certificate.skill1')}</li>
                <li>{t('certificate.skill2')}</li>
                <li>{t('certificate.skill3')}</li>
              </ul>
            </div>
            
            <div className="mt-auto">
              <p className="text-gray-600 mb-4">
                {t('certificate.date', { date: new Date().toLocaleDateString() })}
              </p>
              <div className="flex items-center justify-center space-x-4">
                <span className="text-2xl">🕵️‍♀️</span>
                <span className="text-lg font-semibold text-indigo-700">
                  {t('certificate.signature')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Section */}
        <Card tone="neutral" padding="lg" className="max-w-2xl mx-auto">
          {!feedbackSubmitted ? (
            <>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                How was your Mood Detective experience?
              </h3>
              
              {!showFeedback ? (
                <div className="text-center">
                  <Button
                    variant="success"
                    size="md"
                    onClick={() => setShowFeedback(true)}
                  >
                    Share Your Feedback
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit(submitFeedback)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rate your experience:
                    </label>
                    <div className="flex justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <label key={rating} className="cursor-pointer">
                          <input
                            type="radio"
                            value={rating}
                            {...registerFeedback('emojiRating', { valueAsNumber: true })}
                            className="sr-only"
                          />
                          <span className="text-3xl hover:scale-110 transition-transform">
                            {rating <= 2 ? '😢' : rating <= 3 ? '😐' : rating <= 4 ? '😊' : '😍'}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category:
                    </label>
                    <select
                      {...registerFeedback('category')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="general">General</option>
                      <option value="game">Game</option>
                      <option value="ui">User Interface</option>
                      <option value="content">Content</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comments (optional):
                    </label>
                    <textarea
                      {...registerFeedback('comment')}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Tell us what you think..."
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      {...registerFeedback('helpful')}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label className="text-sm text-gray-700">
                      This feedback is helpful
                    </label>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      variant="sky"
                      className="flex-1"
                    >
                      Submit Feedback
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowFeedback(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </>
          ) : (
            <div className="text-center">
              <div className="text-4xl mb-4">🎉</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Thank you for your feedback!
              </h3>
              <p className="text-gray-600">
                Your input helps us make Mood Detective even better.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
