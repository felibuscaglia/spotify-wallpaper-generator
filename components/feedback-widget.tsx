'use client';

import { useState } from 'react';

interface FeedbackWidgetProps {
  variant?: 'floating' | 'button' | 'inline';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  playlistId?: string;
  className?: string;
}

const FORMSPREE_URL = 'https://formspree.io/f/mldqnvqg';

export default function FeedbackWidget({
  variant = 'floating',
  position = 'bottom-right',
  playlistId,
  className = ''
}: FeedbackWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
    setSubmitted(false);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      // Submit to Formspree using fetch with the form's action URL and POST method
      const response = await fetch(FORMSPREE_URL, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        // Success - show success message
        setSubmitted(true);
        form.reset();

        // Close after 2 seconds
        setTimeout(() => {
          setIsOpen(false);
          setSubmitted(false);
        }, 2000);
      } else {
        // Handle error
        const data = await response.json();
        if (data.errors) {
          console.error('Formspree errors:', data.errors);
        }
        alert('Failed to submit feedback. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    }
  };

  // Get current URL for hidden input
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  // Floating button variant
  if (variant === 'floating' && !isOpen) {
    const positionClasses = {
      'bottom-right': 'bottom-6 right-6',
      'bottom-left': 'bottom-6 left-6',
      'top-right': 'top-6 right-6',
      'top-left': 'top-6 left-6',
    };

    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed ${positionClasses[position]} z-50 w-14 h-14 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#4ADE80] hover:bg-[#4ADE80] dark:hover:bg-[#4ADE80] transition-all border-2 border-black dark:border-white hover:shadow-[2px_2px_0_0_#000] dark:hover:shadow-[2px_2px_0_0_#4ADE80] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] ${className}`}
        aria-label="Open feedback"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>
    );
  }

  // Button variant (for inline use)
  if (variant === 'button' && !isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-sm font-semibold uppercase tracking-wider hover:bg-[#4ADE80] dark:hover:bg-[#4ADE80] transition-all border-2 border-black dark:border-white shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#4ADE80] hover:shadow-[2px_2px_0_0_#000] dark:hover:shadow-[2px_2px_0_0_#4ADE80] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] ${className}`}
      >
        Feedback
      </button>
    );
  }

  // Modal/Form content (shown when isOpen is true)
  const modalContent = (
    <div className="bg-white dark:bg-[#0f0f0f] border-2 border-black dark:border-white shadow-[8px_8px_0_0_#000] dark:shadow-[8px_8px_0_0_#4ADE80] p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-black dark:text-white uppercase tracking-wider">
          Share Feedback
        </h3>
        <button
          onClick={handleClose}
          className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
          aria-label="Close feedback"
          type="button"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {submitted ? (
        <div className="text-center py-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#4ADE80] flex items-center justify-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="3"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p className="text-black dark:text-white font-semibold mb-1">Thank you!</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Your feedback has been submitted.</p>
        </div>
      ) : (
        <form
          action={FORMSPREE_URL}
          method="POST"
          onSubmit={handleFormSubmit}
          className="space-y-4"
        >
          {/* Hidden fields */}
          <input type="hidden" name="url" value={currentUrl} />
          {playlistId && (
            <input type="hidden" name="playlistId" value={playlistId} />
          )}

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-semibold text-black dark:text-white uppercase tracking-wider mb-2"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              required
              className="w-full px-4 py-3 border-2 border-black dark:border-white text-black dark:text-white focus:outline-none focus:ring-4 focus:border-[#4ADE80] focus:ring-[#4ADE80]/20 bg-white dark:bg-[#0f0f0f] font-medium"
            >
              <option value="">Select a category</option>
              <option value="Feature Request">Feature Request</option>
              <option value="Bug Report">Bug Report</option>
              <option value="General Feedback">General Feedback</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="feedback"
              className="block text-sm font-semibold text-black dark:text-white uppercase tracking-wider mb-2"
            >
              Your Feedback
            </label>
            <textarea
              id="feedback"
              name="feedback"
              rows={4}
              required
              className="w-full px-4 py-3 border-2 border-black dark:border-white text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-4 transition-all bg-white dark:bg-[#0f0f0f] font-medium resize-none focus:border-[#4ADE80] focus:ring-[#4ADE80]/20"
              placeholder="Tell us what you think, report a bug, or suggest a feature..."
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 bg-black dark:bg-white text-white dark:text-black text-sm font-semibold uppercase tracking-wider hover:bg-[#4ADE80] dark:hover:bg-[#4ADE80] transition-all border-2 border-black dark:border-white shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#4ADE80] hover:shadow-[2px_2px_0_0_#000] dark:hover:shadow-[2px_2px_0_0_#4ADE80] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
          >
            Submit Feedback
          </button>
        </form>
      )}
    </div>
  );

  // Render based on variant
  if (variant === 'floating' && isOpen) {
    const positionClasses = {
      'bottom-right': 'bottom-6 right-6',
      'bottom-left': 'bottom-6 left-6',
      'top-right': 'top-6 right-6',
      'top-left': 'top-6 left-6',
    };

    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/20 dark:bg-white/10 z-40"
          onClick={handleClose}
          aria-hidden="true"
        />
        {/* Modal */}
        <div className={`fixed ${positionClasses[position]} z-50 w-96 max-w-[calc(100vw-3rem)]`}>
          {modalContent}
        </div>
      </>
    );
  }

  if (variant === 'button' && isOpen) {
    return (
      <>
        <div
          className="fixed inset-0 bg-black/20 dark:bg-white/10 z-40"
          onClick={handleClose}
          aria-hidden="true"
        />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            {modalContent}
          </div>
        </div>
      </>
    );
  }

  // Inline variant
  return (
    <div className={className}>
      {modalContent}
    </div>
  );
}
