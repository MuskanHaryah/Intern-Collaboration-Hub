import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useThemeStore from '../stores/themeStore';
import ThemeToggle from '../components/UI/ThemeToggle';

export default function PrivacyPage() {
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
          <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Privacy Policy</h1>
          <p className={`mb-8 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Last updated: June 2025</p>

          <div className={`space-y-6 text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            <section>
              <h2 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>1. Information We Collect</h2>
              <p className="mb-2">We collect the following types of information:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Account Information:</strong> Name, email address, and password when you create an account.</li>
                <li><strong>Profile Information:</strong> Department, skills, and avatar that you choose to provide.</li>
                <li><strong>Usage Data:</strong> Information about how you use the Service, including projects, tasks, and messages.</li>
                <li><strong>Log Data:</strong> IP address, browser type, and access times when you use the Service.</li>
              </ul>
            </section>

            <section>
              <h2 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>2. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To provide, maintain, and improve the Service.</li>
                <li>To authenticate your identity and manage your account.</li>
                <li>To facilitate collaboration between team members.</li>
                <li>To send notifications related to your projects and tasks.</li>
                <li>To respond to your support requests and inquiries.</li>
              </ul>
            </section>

            <section>
              <h2 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>3. Data Storage & Security</h2>
              <p>
                We implement industry-standard security measures to protect your data, including encrypted 
                passwords (bcrypt hashing), secure HTTPS connections, and JWT-based authentication. Your data 
                is stored in secure MongoDB databases with access controls.
              </p>
            </section>

            <section>
              <h2 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>4. Data Sharing</h2>
              <p>
                We do not sell, rent, or share your personal information with third parties except:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>With your consent or at your direction.</li>
                <li>With other users within your organization as part of the collaboration features.</li>
                <li>When required by law or to comply with legal processes.</li>
                <li>To protect the rights, property, or safety of CollabHub and its users.</li>
              </ul>
            </section>

            <section>
              <h2 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>5. Cookies</h2>
              <p>
                We use localStorage and session storage to maintain your authentication state and preferences 
                (such as theme settings). We do not use third-party tracking cookies.
              </p>
            </section>

            <section>
              <h2 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>6. Your Rights</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Access:</strong> You can access your personal data through your profile settings.</li>
                <li><strong>Update:</strong> You can update your personal information at any time.</li>
                <li><strong>Delete:</strong> You can request deletion of your account and associated data.</li>
                <li><strong>Export:</strong> You can request a copy of your data by contacting support.</li>
              </ul>
            </section>

            <section>
              <h2 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>7. Data Retention</h2>
              <p>
                We retain your data for as long as your account is active or as needed to provide the Service. 
                If you delete your account, we will remove your personal data within 30 days, except where 
                retention is required by law.
              </p>
            </section>

            <section>
              <h2 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>8. Children's Privacy</h2>
              <p>
                The Service is not intended for use by individuals under the age of 13. We do not knowingly 
                collect personal information from children under 13.
              </p>
            </section>

            <section>
              <h2 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>9. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by 
                posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>10. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy, please contact us at{' '}
                <a href="mailto:privacy@collabhub.com" className={`${isDark ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-500'}`}>
                  privacy@collabhub.com
                </a>.
              </p>
            </section>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
