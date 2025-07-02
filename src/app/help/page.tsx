import React from "react";
import { SidebarComponent } from "@/components/sidebar-component";
import { IconHelp, IconMessageCircle, IconBook, IconMail } from "@tabler/icons-react";

const HelpContent = () => {
  return (
    <div className="p-6 md:p-10 h-full flex flex-col">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <IconHelp className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Help Center
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Find answers to common questions, browse our documentation, or get in touch with our support team.
        </p>
      </div>
      
      {/* Quick Actions */}
      <div className="flex-1 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-shadow cursor-pointer">
            <IconBook className="h-8 w-8 text-green-600 dark:text-green-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Documentation
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Comprehensive guides and API documentation for developers and users.
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-shadow cursor-pointer">
            <IconMessageCircle className="h-8 w-8 text-purple-600 dark:text-purple-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Live Chat
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Get instant help from our support team through live chat.
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-shadow cursor-pointer">
            <IconMail className="h-8 w-8 text-orange-600 dark:text-orange-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Email Support
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Send us a detailed message and we'll get back to you within 24 hours.
            </p>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                question: "How does the virtual try-on technology work?",
                answer: "Our AI-powered virtual try-on uses advanced computer vision to map clothing items onto your body, creating realistic visualizations of how garments would look on you."
              },
              {
                question: "What image formats are supported?",
                answer: "We support JPG, PNG, and WebP formats. Images should be at least 512px in width and height for best results."
              },
              {
                question: "Is my data secure and private?",
                answer: "Yes, we take privacy seriously. Your images are processed securely and are not stored permanently on our servers unless you explicitly save them to your account."
              },
              {
                question: "Can I use the service for commercial purposes?",
                answer: "Yes, we offer commercial licenses. Please contact our sales team for enterprise pricing and API access."
              },
              {
                question: "What should I do if the try-on results don't look right?",
                answer: "Try using a well-lit photo with good contrast. Make sure you're facing forward and the clothing item is clearly visible. If issues persist, contact our support team."
              }
            ].map((faq, i) => (
              <div
                key={i}
                className="bg-gray-50 dark:bg-neutral-800/50 p-6 rounded-lg"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-lg border border-blue-200 dark:border-blue-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Still Need Help?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Our support team is here to help you get the most out of Modality. Reach out anytime!
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Start Live Chat
            </button>
            <button className="bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Send Email
            </button>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Quick Tips for Better Results
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Use well-lit photos with minimal shadows",
              "Ensure your full body is visible in the frame",
              "Wear form-fitting clothes for accurate mapping",
              "Face the camera directly for best results",
              "Use high-resolution images (at least 1024px)",
              "Avoid busy backgrounds and patterns"
            ].map((tip, i) => (
              <div
                key={i}
                className="bg-gray-50 dark:bg-neutral-800/50 p-4 rounded-lg flex items-center gap-3"
              >
                <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shrink-0">
                  {i + 1}
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  {tip}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-neutral-900">
      <SidebarComponent>
        <HelpContent />
      </SidebarComponent>
    </div>
  );
} 