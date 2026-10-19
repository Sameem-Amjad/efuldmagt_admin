import { Dialog } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from 'lucide-react'
// import Image from "next/image"

export function PreviewModal({ isOpen, onClose, content }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center h-screen">
        <div className="bg-white max-w-[600px] w-full mx-auto relative">
          {/* Top curved corners */}
          <div className="absolute -top-6 left-0 right-0 h-6 bg-white">
            <div className="absolute inset-0">
              <div className="absolute -top-10 left-0 right-0 h-10 bg-[radial-gradient(25px_at_top,transparent_98%,white)]" />
            </div>
          </div>

          <div className="pt-8 px-8 pb-4">
            {/* Profile Image */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full overflow-hidden">
                <img
                  src="/placeholder.svg"
                  alt="Profile"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-xl font-semibold text-center mb-6">
              Package Collection
            </h2>

            {/* Content */}
            <div 
              className="prose max-w-none mb-8" 
              dangerouslySetInnerHTML={{ __html: content }} 
            />

            {/* Date */}
            <div className="text-center text-sm text-gray-500 mb-4">
              <p className="mb-2">This authorization expires 3 hours after issuance.</p>
              <div className="inline-flex items-center gap-2">
                <span className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-500 text-xs">📅</span>
                </span>
                16. Feb 2023, 10:22AM
              </div>
            </div>
          </div>

          {/* Bottom curved corners */}
          <div className="relative">
            <div className="absolute -bottom-6 left-0 right-0 h-6 bg-white">
              <div className="absolute inset-0">
                <div className="absolute -bottom-10 left-0 right-0 h-10 bg-[radial-gradient(25px_at_bottom,transparent_98%,white)]" />
              </div>
            </div>
          </div>
        </div>

        {/* Close button */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
          <Button
            variant="secondary"
            className="bg-gray-900 text-white hover:bg-gray-800"
            onClick={onClose}
          >
            <X className="w-4 h-4 mr-2" />
            Close Preview
          </Button>
        </div>
      </div>
    </Dialog>
  )
}