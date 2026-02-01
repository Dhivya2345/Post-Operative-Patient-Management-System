import HospitalBg from '../assets/hospital-bg.svg';

type Props = {
  onLogin: () => void;
};

export function Home({ onLogin }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-6 relative">
      {/* background image, low opacity */}
      <img src={HospitalBg} alt="hospital background" className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none -z-10" />

      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-lg overflow-hidden relative z-10">
        <div className="p-8 md:p-12">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 flex items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 p-3">
              {/* simple hospital SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="w-12 h-12 text-white" fill="none">
                <rect x="6" y="20" width="52" height="36" rx="2" fill="white" />
                <path d="M12 20v-6a4 4 0 014-4h32a4 4 0 014 4v6" stroke="#fff" strokeWidth="2" fill="none" opacity="0.12" />
                <rect x="18" y="28" width="10" height="8" rx="1.2" fill="#6b21a8" />
                <rect x="36" y="28" width="10" height="8" rx="1.2" fill="#6b21a8" />
                <rect x="18" y="38" width="28" height="10" rx="1.2" fill="#a78bfa" />
                <path d="M32 10v14" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                <circle cx="32" cy="8" r="3" fill="#fff" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">AI Powered Secure Post-Operative Patient Management System</h1>
              <p className="text-sm text-gray-500 mt-1">Secure, local-first assistant for post-op care, teaching, and patient record access.</p>
            </div>
          </div>

          <p className="text-gray-600 mb-6">A lightweight clinical assistant for patient records, post-op notes, and teaching content for interns. Search patients, review surgeries, and get educational summaries at the bedside.</p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Key features</h3>
              <ul className="list-disc list-inside text-gray-700">
                <li>Search and view patient records securely</li>
                <li>Post-op notes and recovery milestones</li>
                <li>Local teaching modules for common surgeries</li>
                <li>PII-safe responses and role-based access</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Get started</h3>
              <p className="text-gray-600">Sign in to access patient records and the AI assistant. You can explore educational content without sending patient-identifiable data to external services.</p>
              <div className="flex items-center space-x-3">
                <button onClick={onLogin} className="px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg shadow">
                  Log in
                </button>
                <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 9999, behavior: 'smooth' }); }} className="text-sm text-gray-600 underline">Learn more</a>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 p-4 text-sm text-gray-500">Note: This is a demo Home page. Customize content and links as needed.</div>
      </div>
    </div>
  );
}

export default Home;
