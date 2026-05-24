import { useI18n } from '../contexts/I18nContext'
import { Settings } from 'lucide-react'

export default function SettingsPage() {
  const { t } = useI18n()
  
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Settings size={28} className="text-stable-800" />
        <h1 className="text-2xl font-bold text-stone-800">Instellingen</h1>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-12 text-center text-stone-500 flex flex-col items-center gap-4">
        <Settings size={48} className="text-stone-300" />
        <p className="text-lg">Deze module is nog in ontwikkeling.</p>
        <p className="text-sm">Binnenkort kun je hier de stal-instellingen en je profiel aanpassen.</p>
      </div>
    </div>
  )
}
