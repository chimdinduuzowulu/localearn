import { useState, useEffect } from 'react';

const PrivacyPolicy = () => {
  const [activeTab, setActiveTab] = useState('info-collected');
  const [isConsentEnabled, setIsConsentEnabled] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const navigationItems = [
    { id: 'info-collected', label: 'Information We Collect', icon: 'fas fa-database' },
    { id: 'info-usage', label: 'How We Use Information', icon: 'fas fa-chart-line' },
    { id: 'data-storage', label: 'Data Protection', icon: 'fas fa-lock' },
    { id: 'data-sharing', label: 'Data Sharing', icon: 'fas fa-share-alt' },
    { id: 'your-rights', label: 'Your Rights', icon: 'fas fa-user-shield' },
    { id: 'children-privacy', label: "Children's Privacy", icon: 'fas fa-child' },
    { id: 'policy-changes', label: 'Policy Changes', icon: 'fas fa-exchange-alt' },
    { id: 'contact', label: 'Contact Us', icon: 'fas fa-envelope' },
    { id: 'consent', label: 'Consent Management', icon: 'fas fa-toggle-on' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <i className="fas fa-shield-alt text-2xl"></i>
              <h1 className="text-2xl font-bold">Privacy Policy</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handlePrint}
                className="print-button bg-white text-blue-600 px-4 py-2 rounded-lg font-medium flex items-center"
              >
                <i className="fas fa-print mr-2"></i> Print
              </button>
              <button
                id="backToTop"
                className={`fixed bottom-8 right-8 bg-white text-blue-600 p-3 rounded-full shadow-lg transition-opacity duration-300 ${
                  showBackToTop ? 'opacity-100' : 'opacity-0'
                }`}
                onClick={scrollToTop}
              >
                <i className="fas fa-arrow-up"></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Introduction */}
        <section className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center mb-4">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <i className="fas fa-info-circle text-blue-600 text-xl"></i>
            </div>
            <h2 className="text-2xl font-bold">Welcome to DigiLingua's Privacy Policy</h2>
          </div>
          <p className="text-gray-700 mb-4">
            At DigiLingua, we respect your privacy and are committed to protecting your personal data. This privacy policy explains, in simple terms, how we collect, use, and protect your information when you use our mobile application.
          </p>
          <p className="text-gray-700">
            We want you to feel safe and informed, especially as our goal is to make digital learning accessible to everyone, including rural communities across Nigeria and Africa.
          </p>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-blue-800 flex items-start">
              <i className="fas fa-lightbulb text-yellow-500 text-xl mr-2 mt-1"></i>
              <span>Effective Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}. This policy applies to all users of the DigiLingua App.</span>
            </p>
          </div>
        </section>

        {/* Quick Navigation */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Navigation</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => scrollToSection('info-collected')}
              className="highlight-box bg-white rounded-lg p-4 shadow-sm text-center hover:bg-blue-50 transition-colors"
            >
              <i className="fas fa-database text-blue-600 text-2xl mb-2"></i>
              <p className="font-medium">Information We Collect</p>
            </button>
            <button
              onClick={() => scrollToSection('info-usage')}
              className="highlight-box bg-white rounded-lg p-4 shadow-sm text-center hover:bg-blue-50 transition-colors"
            >
              <i className="fas fa-chart-line text-green-600 text-2xl mb-2"></i>
              <p className="font-medium">How We Use Information</p>
            </button>
            <button
              onClick={() => scrollToSection('data-storage')}
              className="highlight-box bg-white rounded-lg p-4 shadow-sm text-center hover:bg-blue-50 transition-colors"
            >
              <i className="fas fa-lock text-purple-600 text-2xl mb-2"></i>
              <p className="font-medium">Data Protection</p>
            </button>
            <button
              onClick={() => scrollToSection('your-rights')}
              className="highlight-box bg-white rounded-lg p-4 shadow-sm text-center hover:bg-blue-50 transition-colors"
            >
              <i className="fas fa-user-shield text-red-600 text-2xl mb-2"></i>
              <p className="font-medium">Your Rights</p>
            </button>
          </div>
        </section>

        {/* Privacy Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Table of Contents */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <h3 className="text-lg font-semibold mb-4">Table of Contents</h3>
              <ul className="space-y-2">
                {navigationItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className={`text-blue-600 hover:underline w-full text-left flex items-center ${
                        activeTab === item.id ? 'font-bold' : ''
                      }`}
                    >
                      <i className={`${item.icon} mr-2 w-5`}></i>
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Information Collected */}
            <section
              id="info-collected"
              className="bg-white rounded-xl shadow-sm p-6 mb-8"
              onMouseEnter={() => setActiveTab('info-collected')}
            >
              <h2 className="text-xl font-semibold mb-4 relative pl-6 before:content-[''] before:absolute before:left-0 before:top-1/2 before:transform before:-translate-y-1/2 before:h-6 before:w-1 before:bg-blue-500 before:rounded">
                1. The Information We Collect
              </h2>
              <p className="text-gray-700 mb-4">When you use our app, we may collect:</p>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <i className="fas fa-user-circle text-blue-600 mr-2"></i>
                    <h3 className="font-medium">Basic Details</h3>
                  </div>
                  <p className="text-sm text-gray-700">Name, phone number, or email (if you register an account)</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <i className="fas fa-chart-pie text-green-600 mr-2"></i>
                    <h3 className="font-medium">Usage Data</h3>
                  </div>
                  <p className="text-sm text-gray-700">How you use the app, such as lessons watched or progress made</p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <i className="fas fa-mobile-alt text-purple-600 mr-2"></i>
                    <h3 className="font-medium">Device Information</h3>
                  </div>
                  <p className="text-sm text-gray-700">Language settings, type of phone, or network, to improve your experience</p>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <i className="fas fa-comment-dots text-yellow-600 mr-2"></i>
                    <h3 className="font-medium">Optional Data</h3>
                  </div>
                  <p className="text-sm text-gray-700">If you choose to share feedback, surveys, or community discussions</p>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-700 flex items-start">
                  <i className="fas fa-ban text-red-500 mr-2 mt-1"></i>
                  <span>We do not collect unnecessary information, and we do not sell your data to anyone.</span>
                </p>
              </div>
            </section>

            {/* Information Usage */}
            <section
              id="info-usage"
              className="bg-white rounded-xl shadow-sm p-6 mb-8"
              onMouseEnter={() => setActiveTab('info-usage')}
            >
              <h2 className="text-xl font-semibold mb-4 relative pl-6 before:content-[''] before:absolute before:left-0 before:top-1/2 before:transform before:-translate-y-1/2 before:h-6 before:w-1 before:bg-blue-500 before:rounded">
                2. Why We Collect This Information
              </h2>
              <p className="text-gray-700 mb-4">We collect and use your information to:</p>
              
              <ul className="space-y-3">
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                  <span>Provide you with access to digital learning in your local language</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                  <span>Improve the lessons, tutorials, and overall user experience</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                  <span>Communicate with you about updates, new features, or important changes</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                  <span>Keep the app safe, secure, and running smoothly</span>
                </li>
              </ul>
            </section>

            {/* Data Storage & Protection */}
            <section
              id="data-storage"
              className="bg-white rounded-xl shadow-sm p-6 mb-8"
              onMouseEnter={() => setActiveTab('data-storage')}
            >
              <h2 className="text-xl font-semibold mb-4 relative pl-6 before:content-[''] before:absolute before:left-0 before:top-1/2 before:transform before:-translate-y-1/2 before:h-6 before:w-1 before:bg-blue-500 before:rounded">
                3. How We Store and Protect Your Data
              </h2>
              
              <div className="flex items-start mb-4">
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <i className="fas fa-database text-blue-600"></i>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Secure Storage</h3>
                  <p className="text-gray-700">Your data is stored securely and only for as long as it is needed for learning purposes.</p>
                </div>
              </div>
              
              <div className="flex items-start mb-4">
                <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <i className="fas fa-shield-alt text-green-600"></i>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Security Measures</h3>
                  <p className="text-gray-700">We use strong security measures to prevent unauthorized access.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <i className="fas fa-user-lock text-purple-600"></i>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Access Control</h3>
                  <p className="text-gray-700">Only authorized team members or trusted partners can handle your data, and only when necessary.</p>
                </div>
              </div>
            </section>

            {/* Data Sharing */}
            <section
              id="data-sharing"
              className="bg-white rounded-xl shadow-sm p-6 mb-8"
              onMouseEnter={() => setActiveTab('data-sharing')}
            >
              <h2 className="text-xl font-semibold mb-4 relative pl-6 before:content-[''] before:absolute before:left-0 before:top-1/2 before:transform before:-translate-y-1/2 before:h-6 before:w-1 before:bg-blue-500 before:rounded">
                4. Sharing of Information
              </h2>
              <p className="text-gray-700 mb-4">We do not share your personal information with third parties except:</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <i className="fas fa-gavel text-red-600 mr-2"></i>
                    <h3 className="font-medium">Legal Requirements</h3>
                  </div>
                  <p className="text-sm text-gray-700">When required by law or government regulations</p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <i className="fas fa-hands-helping text-blue-600 mr-2"></i>
                    <h3 className="font-medium">Trusted Partners</h3>
                  </div>
                  <p className="text-sm text-gray-700">When working with trusted partners (such as hosting providers) who help us run the app securely</p>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-700 flex items-start">
                  <i className="fas fa-info-circle text-blue-500 mr-2 mt-1"></i>
                  <span>Even when sharing is necessary, we make sure your data is handled safely and in accordance with this policy.</span>
                </p>
              </div>
            </section>

            {/* Your Rights */}
            <section
              id="your-rights"
              className="bg-white rounded-xl shadow-sm p-6 mb-8"
              onMouseEnter={() => setActiveTab('your-rights')}
            >
              <h2 className="text-xl font-semibold mb-4 relative pl-6 before:content-[''] before:absolute before:left-0 before:top-1/2 before:transform before:-translate-y-1/2 before:h-6 before:w-1 before:bg-blue-500 before:rounded">
                5. Your Rights
              </h2>
              <p className="text-gray-700 mb-4">As a user in Nigeria and across Africa, you have the right to:</p>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-white border border-blue-200 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <i className="fas fa-eye text-blue-600 mr-2"></i>
                    <h3 className="font-medium">Access Your Data</h3>
                  </div>
                  <p className="text-sm text-gray-700">Request access to the personal data we hold about you</p>
                </div>
                
                <div className="bg-white border border-green-200 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <i className="fas fa-edit text-green-600 mr-2"></i>
                    <h3 className="font-medium">Correct Your Data</h3>
                  </div>
                  <p className="text-sm text-gray-700">Ask us to correct or delete your information</p>
                </div>
                
                <div className="bg-white border border-purple-200 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <i className="fas fa-times-circle text-purple-600 mr-2"></i>
                    <h3 className="font-medium">Withdraw Consent</h3>
                  </div>
                  <p className="text-sm text-gray-700">Withdraw your consent at any time</p>
                </div>
                
                <div className="bg-white border border-red-200 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <i className="fas fa-exclamation-triangle text-red-600 mr-2"></i>
                    <h3 className="font-medium">Report Concerns</h3>
                  </div>
                  <p className="text-sm text-gray-700">Report concerns to Nigeria's NDPR authority (NITDA) or your local data protection body</p>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-800 flex items-start">
                  <i className="fas fa-lightbulb text-yellow-500 mr-2 mt-1"></i>
                  <span>You can exercise these rights by contacting us using the details in the "Contact Us" section or through your app settings.</span>
                </p>
              </div>
            </section>

            {/* Children's Privacy */}
            <section
              id="children-privacy"
              className="bg-white rounded-xl shadow-sm p-6 mb-8"
              onMouseEnter={() => setActiveTab('children-privacy')}
            >
              <h2 className="text-xl font-semibold mb-4 relative pl-6 before:content-[''] before:absolute before:left-0 before:top-1/2 before:transform before:-translate-y-1/2 before:h-6 before:w-1 before:bg-blue-500 before:rounded">
                6. Children's Privacy
              </h2>
              <div className="flex items-start">
                <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <i className="fas fa-child text-yellow-600"></i>
                </div>
                <div>
                  <p className="text-gray-700">Our app is designed to support learning, but we do not knowingly collect personal data from children under 13 without parental consent. If we become aware that we have collected personal data from a child under 13 without verification of parental consent, we take steps to remove that information from our servers.</p>
                </div>
              </div>
            </section>

            {/* Policy Changes */}
            <section
              id="policy-changes"
              className="bg-white rounded-xl shadow-sm p-6 mb-8"
              onMouseEnter={() => setActiveTab('policy-changes')}
            >
              <h2 className="text-xl font-semibold mb-4 relative pl-6 before:content-[''] before:absolute before:left-0 before:top-1/2 before:transform before:-translate-y-1/2 before:h-6 before:w-1 before:bg-blue-500 before:rounded">
                7. Changes to this Policy
              </h2>
              <div className="flex items-start">
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <i className="fas fa-exchange-alt text-blue-600"></i>
                </div>
                <div>
                  <p className="text-gray-700">We may update this Privacy Policy from time to time. If we make important changes, we will let you know through the app or other communication channels. We encourage you to review this policy periodically to stay informed about how we are protecting your information.</p>
                </div>
              </div>
            </section>

            {/* Contact Us */}
            <section
              id="contact"
              className="bg-white rounded-xl shadow-sm p-6 mb-8"
              onMouseEnter={() => setActiveTab('contact')}
            >
              <h2 className="text-xl font-semibold mb-4 relative pl-6 before:content-[''] before:absolute before:left-0 before:top-1/2 before:transform before:-translate-y-1/2 before:h-6 before:w-1 before:bg-blue-500 before:rounded">
                8. Contact Us
              </h2>
              <p className="text-gray-700 mb-4">If you have any questions about this Privacy Policy or how we handle your data, please contact us:</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <i className="fas fa-envelope text-blue-600"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">privacy@digilingua.com</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <i className="fas fa-phone text-green-600"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone/WhatsApp</p>
                    <p className="font-medium">+234 800 123 4567</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                    <i className="fas fa-map-marker-alt text-purple-600"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-medium">123 Innovation Road, Tech District, Lagos, Nigeria</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                    <i className="fas fa-clock text-yellow-600"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Response Time</p>
                    <p className="font-medium">Within 48 hours</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Consent Management */}
            <section
              id="consent"
              className="bg-white rounded-xl shadow-sm p-6 mb-8"
              onMouseEnter={() => setActiveTab('consent')}
            >
              <h2 className="text-xl font-semibold mb-4 relative pl-6 before:content-[''] before:absolute before:left-0 before:top-1/2 before:transform before:-translate-y-1/2 before:h-6 before:w-1 before:bg-blue-500 before:rounded">
                9. Consent to Data Collection
              </h2>
              <p className="text-gray-700 mb-4">Before we collect any personal data from you, we will ask for your clear permission.</p>
              
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-blue-800 font-medium mb-2">By tapping "I Agree" or continuing to use our app, you are confirming that:</p>
                <ul className="list-disc list-inside text-blue-800 pl-4">
                  <li>You understand why your data may be collected</li>
                  <li>You agree to us using your data as explained in this Privacy Policy</li>
                  <li>You know you can withdraw your consent anytime by contacting us or changing your app settings</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <i className="fas fa-info-circle text-blue-500 mr-2"></i>
                  If you do not agree, you can still use most of the learning features that do not require personal information.
                </p>
              </div>
              
              {/* Consent Toggle for Demonstration */}
              <div className="mt-6 p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Your Current Consent Status</p>
                    <p className="text-sm text-gray-600">You can update your data collection preferences here</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={isConsentEnabled}
                      onChange={() => setIsConsentEnabled(!isConsentEnabled)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                {isConsentEnabled && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Customize your consent preferences:</p>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input type="checkbox" id="usageData" className="mr-2" defaultChecked />
                        <label htmlFor="usageData" className="text-sm">Allow usage data collection</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="personalization" className="mr-2" defaultChecked />
                        <label htmlFor="personalization" className="text-sm">Allow personalized learning experience</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="communications" className="mr-2" defaultChecked />
                        <label htmlFor="communications" className="text-sm">Allow communications about updates</label>
                      </div>
                    </div>
                    <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium">Save Preferences</button>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">DigiLingua App</h3>
              <p className="text-gray-400">Making digital learning accessible to everyone</p>
            </div>
            <div>
              <p className="text-gray-400">© 2023 DigiLingua. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;