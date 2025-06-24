import Head from 'next/head';
import Header from '../components/Header';

export default function SupportPage() {
  return (
    <>
      <Head>
        <title>Support - Slots Planet</title>
        <meta name="description" content="Get help and support for your casino gaming experience" />
        <link rel="stylesheet" href="/styles/main.css" />
      </Head>

      <div className="main-layout">
        <Header />
        
        <div className="main-content">
          <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Support Center</h1>
            <p className="text-xl text-gray-300">Get help with your casino gaming experience</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-black/30 backdrop-blur-md border border-purple-500/30 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-4">🎰 Casino Support</h2>
              <p className="text-gray-300 mb-4">Need help with casino games, bonuses, or account issues?</p>
              <ul className="text-gray-300 space-y-2">
                <li>• Account verification help</li>
                <li>• Bonus and promotion questions</li>
                <li>• Game rules and strategies</li>
                <li>• Payment and withdrawal support</li>
              </ul>
            </div>

            <div className="bg-black/30 backdrop-blur-md border border-purple-500/30 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-4">⚡ Quick Help</h2>
              <p className="text-gray-300 mb-4">Find answers to common questions</p>
              <ul className="text-gray-300 space-y-2">
                <li>• How to claim bonuses</li>
                <li>• Understanding wagering requirements</li>
                <li>• Setting up your account</li>
                <li>• Responsible gaming tools</li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-black/30 backdrop-blur-md border border-purple-500/30 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">📞 Contact Support</h2>
              <p className="text-gray-300 mb-6">Our support team is available 24/7 to assist you</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">📧 Email</h3>
                  <p className="text-gray-300">support@slotsplanet.com</p>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">💬 Live Chat</h3>
                  <p className="text-gray-300">Available 24/7</p>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">📱 Telegram</h3>
                  <p className="text-gray-300">@SlotsSupport</p>
                </div>
              </div>
            </div>

            <p className="text-gray-400 text-sm">
              For the best casino gaming experience, always play responsibly and within your limits.
            </p>
          </div>
          </div>
          </main>
        </div>
      </div>
    </>
  );
} 