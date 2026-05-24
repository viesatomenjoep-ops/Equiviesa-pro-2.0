import { useI18n } from '../contexts/I18nContext'
import { FolderOpen } from 'lucide-react'

export default function DocumentsPage() {
  const { t } = useI18n()
  
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <FolderOpen size={28} className="text-stable-800" />
        <h1 className="text-2xl font-bold text-stone-800">Documenten</h1>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-12 text-center text-stone-500 flex flex-col items-center gap-4">
        <FolderOpen size={48} className="text-stone-300" />
        <p className="text-lg">Deze module is nog in ontwikkeling.</p>
        <p className="text-sm">Binnenkort kun je hier paspoorten en belangrijke contracten veilig opslaan.</p>
      </div>
    </div>
  )
}
