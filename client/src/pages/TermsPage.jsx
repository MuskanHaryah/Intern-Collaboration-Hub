import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useThemeStore from '../stores/themeStore';
import ThemeToggle from '../components/UI/ThemeToggle';

export default function TermsPage() {
  const theme = useThemeStore((s) => s.theme);
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen px-4 py-12 transition-colors duration-500 ${
      isDark ? 'bg-[#0a0a0f]' : 'bg-[#f8f9fc]'
    }`}>
      {/* Background effects */}
      <div className={`fixed inset-0 ${
        isDark 
          ? 'bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20' 
          : 'bg-gradient-to-br from-purple-100/60 via-transparent to-pink-100/60'
      }`} />

      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto relative z-10"
      >
        {/* Back link + Logo */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
              C
            </div>
            <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>CollabHub</span>
          </Link>
          <Link
            to="/register"
            className={`text-sm font-medium transition-colors ${isDark ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-500'}`}
          >
            &larr; Back to Register
          </Link>
        </div>

        {/* Content Card */}
        <div className={`backdrop-blur-xl rounded-2xl p-8 md:p-12 shadow-2xl border transition-colors duration-500 ${
          isDark 
            ? 'bg-[#12121a]/80 border-white/10' 
            : 'bg-white/90 border-gray-200'
        }`}>
          <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Terms of Service</h1>
          <p className={`mb-8 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Last updated: June 2025</p>

          <div className={`space-y-6 text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            <section>
              <h2 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>1. Acceptance of Terms</h2>
              <p>
                By accessing or using the CollabHub platform ("Service"), you agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use the Service.
              </p>
            </section>

            <section>
              <h2 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>2. Description of Service</h2>
              <p>
                CollabHub is an intern collaboration platform that provides tools for project management, 
                real-time communication, task tracking, and team collaboration. The Service is designed to 
                facilitate teamwork among interns and mentors within organizations.
              </p>
            </section>

            <section>
              <h2 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>3. User Accounts</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>You must provide accurate and complete information when creating an account.</li>
                <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
                <li>You are responsible for all activities that occur under your account.</li>
                <li>You must notify us immediately of any unauthorized use of your account.</li>
              </ul>
            </section>

            <section>
              <h2 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>4. Acceptable Use</h2>
              <p className="mb-2">You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the Service for any unlawful purpose or in violation of any regulations.</li>
                <li>Upload or share content that is offensive, harmful, or infringes on intellectual property rights.</li>
                <li>Attempt to gain unauthorized access to other users' accounts or the Service's systems.</li>
                <li>Interfere with or disrupt the Service or servers connected to the Service.</li>
                <li>Use automated systems to access the Service without permission.</li>
              </ul>
            </section>

            <section>
              <h2 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>5. Content</h2>
              <p>
                You retain ownership of content you create and upload to the Service. By using the Service, 
                you grant CollabHub a non-exclusive license to use, display, and distribute your content 
                solely for the purpose of operating and improving the Service.
              </p>
            </section>

            <section>
              <h2 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>6. Termination</h2>
              <p>
                We reserve the right to suspend or terminate your account at any time if you violate these 
                Terms of Service. You may also delete your account at any time by contacting support.
              </p>
            </section>

            <section>
              <h2 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>7. Limitation of Liability</h2>
              <p>
                The Service is provided "as is" without warranties of any kind. CollabHub shall not be liable 
                for any indirect, incidental, or consequential damages arising from the use of the Service.
              </p>
            </section>

            <section>
              <h2 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>8. Changes to Terms</h2>
              <p>
                We may update these Terms from time to time. We will notify users of any material changes via 
                the Service or email. Continued use of the Service after changes constitutes acceptance of the 
                updated Terms.
              </p>
            </section>

            <section>
              <h2 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>9. Contact</h2>
              <p>
                If you have questions about these Terms, please contact us at{' '}
                <a href="mailto:support@collabhub.com" className={`${isDark ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-500'}`}>
                  support@collabhub.com
                </a>.
              </p>
            </section>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
