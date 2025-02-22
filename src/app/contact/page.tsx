import Link from 'next/link';
import { FaFacebookMessenger, FaGithub, FaDiscord } from 'react-icons/fa';

export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12  min-h-[70vh] flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-8 text-[#E2E4FF]">Contact Us</h1>
      
      <div className="mb-8">
        <p className="text-base mb-4 text-[#B4B7E5]">
          Have questions or feedback? We&apos;d love to hear from you. Get in touch with us through:
        </p>
        
        <div className="bg-slate-900 rounded-lg p-6 mb-8">
          <h2 className="text-base font-semibold mb-2 text-[#E2E4FF]">Email</h2>
          <a 
            href="mailto:xianvy0000@gmail.com" 
            className="text-[#B4B7E5] hover:text-white transition-colors text-sm"
          >
            xianvy0000@gmail.com
          </a>
        </div>

        <div className="bg-slate-900 rounded-lg p-6">
          <h2 className="text-base font-semibold mb-4 text-[#E2E4FF]">Connect With Us</h2>
          <div className="flex space-x-6">
            <Link
              href="https://discord.com/crispysnowflake"
              target="_blank"
              className="text-[#B4B7E5] hover:text-white transition-colors"
            >
              <FaDiscord size={18} />
            </Link>
            <Link 
              href="https://github.com/xian-vy" 
              target="_blank" 
              className="text-[#B4B7E5] hover:text-white transition-colors"
            >
              <FaGithub size={18} />
            </Link>
            <Link 
              href="https://facebook.com/crispysnowflake" 
              target="_blank" 
              className="text-[#B4B7E5] hover:text-white transition-colors"
            >
              <FaFacebookMessenger size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 