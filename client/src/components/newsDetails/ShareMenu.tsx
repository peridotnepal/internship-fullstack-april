// NewsDetailModal/ShareMenu.tsx
import { forwardRef } from "react"
import { Facebook, Twitter, Linkedin, Mail, Link } from "lucide-react"

interface ShareMenuProps {
  handleShare: (platform: string) => void
}

export const ShareMenu = forwardRef<HTMLDivElement, ShareMenuProps>(
  ({ handleShare }, ref) => (
    <div 
      ref={ref}
      className="absolute right-10 top-32 bg-gray-800 rounded-lg shadow-lg py-2 z-[60] w-40 border border-gray-700"
    >
      <button 
        className="w-full px-4 py-2 flex items-center hover:bg-gray-700 text-gray-300"
        onClick={() => handleShare('facebook')}
      >
        <Facebook className="h-4 w-4 mr-3" />
        <span>Facebook</span>
      </button>
      <button 
        className="w-full px-4 py-2 flex items-center hover:bg-gray-700 text-gray-300"
        onClick={() => handleShare('twitter')}
      >
        <Twitter className="h-4 w-4 mr-3" />
        <span>Twitter</span>
      </button>
      <button 
        className="w-full px-4 py-2 flex items-center hover:bg-gray-700 text-gray-300"
        onClick={() => handleShare('linkedin')}
      >
        <Linkedin className="h-4 w-4 mr-3" />
        <span>LinkedIn</span>
      </button>
      <button 
        className="w-full px-4 py-2 flex items-center hover:bg-gray-700 text-gray-300"
        onClick={() => handleShare('email')}
      >
        <Mail className="h-4 w-4 mr-3" />
        <span>Email</span>
      </button>
      <div className="h-px bg-gray-700 my-1"></div>
      <button 
        className="w-full px-4 py-2 flex items-center hover:bg-gray-700 text-gray-300"
        onClick={() => handleShare('copy')}
      >
        <Link className="h-4 w-4 mr-3" />
        <span>Copy Link</span>
      </button>
    </div>
  )
)
ShareMenu.displayName = "ShareMenu"