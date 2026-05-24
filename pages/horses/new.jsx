import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useI18n } from '../../contexts/I18nContext'
import { ArrowLeft, Camera, Save } from 'lucide-react'

const STEPS = ['info', 'details', 'health', 'done']

export default function NewHorsePage() {
  const { t } = useI18n()
  const router = useRouter()
  const [step, setStep]     = useState(0)
  const [saving, setSaving] = useState(false)
  const [form, setForm]     = useState({
    name:'', breed:'', sex:'', date_of_birth:'', color:'', markings:'',
    chip_number:'', passport_number:'', weight_kg:'', height_cm:'',
    box_number:'', discipline:'', owner_name:'', purchase_date:'',
    insurance_number:'', notes:'', photo_url:''
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const StepDot = ({ i, label }) => (
    <div className={`flex items-center gap-2 ${i <= step ? 'text-stable-700' : 'text-stone-400'}`}>
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2
        ${i < step ? 'bg-stable-600 border-stable-600 text-white'
         : i === step ? 'border-stable-600 text-stable-700 bg-white'
         : 'border-stone-300 text-stone-400'}`}>
        {i < step ? '✓' : i + 1}
      </div>
      <span className="hidden sm:block text-sm font-medium">{label}</span>
    </div>
  )

  async function handleSave() {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    setSaving(false)
    setStep(3)
  }

  if (step === 3) return (
    <div className="max-w-md mx-auto text-center py-16 space-y-4">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
        <span className="text-3xl">🐴</span>
      </div>
      <h2 className="text-2xl font-bold text-stone-800">{form.name || 'Paard'} toegevoegd!</h2>
      <p className="text-stone-500">Het paard is opgeslagen in de database.</p>
      <div className="flex gap-3 justify-center pt-2">
        <Link href="/horses" className="btn-secondary px-6">{t('horses.title')}</Link>
        <button onClick={() => { setStep(0); setForm({}) }} className="btn-primary px-6">Nog een toevoegen</button>
      </div>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/horses" className="btn-secondary w-11 h-11 p-0 flex-shrink-0">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-stone-800">{t('horses.new')}</h1>
          <p className="text-stone-500 text-sm">Stap {step + 1} van 3</p>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1">
        {['Basisinfo', 'Details', 'Gezondheid & Opslaan'].map((l, i) => (
          <div key={i} className="flex items-center gap-2 flex-shrink-0">
            <StepDot i={i} label={l} />
            {i < 2 && <div className={`w-10 h-0.5 ${i < step ? 'bg-stable-500' : 'bg-stone-200'}`} />}
          </div>
        ))}
      </div>

      <div className="card space-y-5">

        {/* Step 0: basic info */}
        {step === 0 && (
          <>
            {/* Photo upload */}
            <div className="flex justify-center">
              <div className="w-28 h-28 rounded-2xl bg-stone-100 border-2 border-dashed border-stone-300 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-stone-50 transition-colors">
                <Camera size={28} className="text-stone-400" />
                <span className="text-xs text-stone-400">{t('horses.uploadPhoto')}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="label">{t('horses.name')} *</label>
                <input className="input" placeholder="bijv. Sultan" value={form.name} onChange={e => set('name', e.target.value)} />
              </div>
              <div>
                <label className="label">{t('horses.breed')} *</label>
                <input className="input" placeholder="bijv. KWPN" value={form.breed} onChange={e => set('breed', e.target.value)} />
              </div>
              <div>
                <label className="label">{t('horses.sex')} *</label>
                <select className="select" value={form.sex} onChange={e => set('sex', e.target.value)}>
                  <option value="">— {t('common.required')} —</option>
                  <option value="stallion">{t('horses.stallion')}</option>
                  <option value="mare">{t('horses.mare')}</option>
                  <option value="gelding">{t('horses.gelding')}</option>
                </select>
              </div>
              <div>
                <label className="label">{t('horses.dateOfBirth')}</label>
                <input type="date" className="input" value={form.date_of_birth} onChange={e => set('date_of_birth', e.target.value)} />
              </div>
              <div>
                <label className="label">{t('horses.color')}</label>
                <input className="input" placeholder="bijv. Vos" value={form.color} onChange={e => set('color', e.target.value)} />
              </div>
              <div>
                <label className="label">{t('horses.boxNumber')}</label>
                <input className="input" placeholder="bijv. A1" value={form.box_number} onChange={e => set('box_number', e.target.value)} />
              </div>
              <div>
                <label className="label">{t('horses.discipline')}</label>
                <input className="input" placeholder="bijv. Dressuur" value={form.discipline} onChange={e => set('discipline', e.target.value)} />
              </div>
            </div>
          </>
        )}

        {/* Step 1: details */}
        {step === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">{t('horses.chipNumber')}</label>
              <input className="input" placeholder="15-cijferig chipnummer" value={form.chip_number} onChange={e => set('chip_number', e.target.value)} />
            </div>
            <div>
              <label className="label">{t('horses.passportNumber')}</label>
              <input className="input" value={form.passport_number} onChange={e => set('passport_number', e.target.value)} />
            </div>
            <div>
              <label className="label">{t('horses.weightKg')}</label>
              <input type="number" className="input" placeholder="bijv. 550" value={form.weight_kg} onChange={e => set('weight_kg', e.target.value)} />
            </div>
            <div>
              <label className="label">{t('horses.heightCm')}</label>
              <input type="number" className="input" placeholder="bijv. 165" value={form.height_cm} onChange={e => set('height_cm', e.target.value)} />
            </div>
            <div>
              <label className="label">{t('horses.owner')}</label>
              <input className="input" value={form.owner_name} onChange={e => set('owner_name', e.target.value)} />
            </div>
            <div>
              <label className="label">{t('horses.purchaseDate')}</label>
              <input type="date" className="input" value={form.purchase_date} onChange={e => set('purchase_date', e.target.value)} />
            </div>
            <div>
              <label className="label">{t('horses.insurance')}</label>
              <input className="input" value={form.insurance_number} onChange={e => set('insurance_number', e.target.value)} />
            </div>
            <div>
              <label className="label">{t('horses.markings')}</label>
              <input className="input" placeholder="bijv. Witte bles" value={form.markings} onChange={e => set('markings', e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">{t('common.notes')}</label>
              <textarea className="input min-h-[80px]" value={form.notes} onChange={e => set('notes', e.target.value)} />
            </div>
          </div>
        )}

        {/* Step 2: health + save */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-stone-600 bg-stable-50 border border-stable-200 rounded-xl p-4">
              Na het opslaan kun je via de <strong>Gezondheidszorg</strong>-sectie de hoefverzorging, ontworming, vaccinaties en medicatie toevoegen.
            </p>
            <div className="space-y-3 bg-stone-50 rounded-2xl p-4">
              <h3 className="font-semibold text-stone-700">Overzicht</h3>
              {[
                [t('horses.name'),    form.name    || '—'],
                [t('horses.breed'),   form.breed   || '—'],
                [t('horses.sex'),     form.sex     || '—'],
                [t('horses.boxNumber'), form.box_number || '—'],
                [t('horses.weightKg'), form.weight_kg ? `${form.weight_kg} kg` : '—'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm">
                  <span className="text-stone-500">{k}</span>
                  <span className="font-medium text-stone-800">{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nav buttons */}
        <div className="flex justify-between pt-2 border-t border-stone-100">
          <button onClick={() => setStep(s => Math.max(0, s - 1))} className={`btn-secondary ${step === 0 ? 'invisible' : ''}`}>
            <ArrowLeft size={18} /> {t('common.previous')}
          </button>
          {step < 2
            ? <button onClick={() => setStep(s => s + 1)} className="btn-primary" disabled={step === 0 && !form.name}>
                {t('common.next')} →
              </button>
            : <button onClick={handleSave} className="btn-primary" disabled={saving}>
                {saving ? t('common.loading') : <><Save size={18} /> {t('common.save')}</>}
              </button>
          }
        </div>
      </div>
    </div>
  )
}
