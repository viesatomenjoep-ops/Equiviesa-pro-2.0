import { useState } from 'react'
import Link from 'next/link'
import { useI18n } from '../../contexts/I18nContext'
import { Plus, Search, Filter, AlertTriangle, CheckCircle } from 'lucide-react'

const HORSES = [
  { id:1,  name:'Sultan',   breed:'KWPN',        age:8,  sex:'gelding', color:'Vos',        box:'B1', discipline:'Dressuur B',    status:'ok',   vet:'15 jun 2026', w:620, photo:null },
  { id:2,  name:'Nova',     breed:'Andalusiër',  age:5,  sex:'mare',    color:'Schimmel',   box:'A3', discipline:'Springpaard',   status:'ok',   vet:'3 jun 2026',  w:510, photo:null },
  { id:3,  name:'Bravo',    breed:'Friese',      age:12, sex:'gelding', color:'Zwart',      box:'C2', discipline:'Recreatie',     status:'warn', vet:'28 mei 2026', w:590, photo:null },
  { id:4,  name:'Stella',   breed:'Hannoveraner',age:7,  sex:'mare',    color:'Bruin',      box:'A1', discipline:'Dressuur L1',   status:'ok',   vet:'20 jun 2026', w:540, photo:null },
  { id:5,  name:'Khan',     breed:'Arabier',     age:10, sex:'gelding', color:'Vos',        box:'B3', discipline:'Endurance',     status:'ok',   vet:'8 jul 2026',  w:455, photo:null },
  { id:6,  name:'Duchess',  breed:'Hanoverian',  age:6,  sex:'mare',    color:'Donkerbruin',box:'A2', discipline:'Springen M',    status:'ok',   vet:'2 jul 2026',  w:555, photo:null },
  { id:7,  name:'Orion',    breed:'KWPN',        age:4,  sex:'stallion',color:'Bruin',      box:'D1', discipline:'Young Horse',   status:'warn', vet:'1 jun 2026',  w:490, photo:null },
  { id:8,  name:'Luna',     breed:'Lusitano',    age:9,  sex:'mare',    color:'Schimmel',   box:'B2', discipline:'Dressuur Z1',   status:'ok',   vet:'18 jun 2026', w:500, photo:null },
  { id:9,  name:'Maximus',  breed:'Belgisch WB', age:11, sex:'gelding', color:'Zwart',      box:'C1', discipline:'Springen Z1',   status:'ok',   vet:'25 jun 2026', w:600, photo:null },
  { id:10, name:'Daydream', breed:'Andalusiër',  age:3,  sex:'mare',    color:'Vos',        box:'D2', discipline:'Opfok',         status:'warn', vet:'10 jul 2026', w:380, photo:null },
  { id:11, name:'Rebel',    breed:'Thoroughbred',age:7,  sex:'stallion',color:'Bruin',      box:'C3', discipline:'Hippodroom',    status:'ok',   vet:'31 mei 2026', w:480, photo:null },
  { id:12, name:'Isis',     breed:'Friese',      age:14, sex:'mare',    color:'Zwart',      box:'A4', discipline:'Recreatie',     status:'ok',   vet:'5 jul 2026',  w:570, photo:null },
]

const AVATARS = [
  ['#B5D4F4','#0C447C'],['#9FE1CB','#085041'],['#C0DD97','#27500A'],['#FAC775','#633806'],
  ['#CECBF6','#3C3489'],['#F4C0D1','#72243E'],['#B5D4F4','#185FA5'],['#9FE1CB','#0F6E56'],
  ['#C0DD97','#3B6D11'],['#FAC775','#854F0B'],['#CECBF6','#534AB7'],['#F4C0D1','#993556'],
]

export default function HorsesPage() {
  const { t } = useI18n()
  const [query, setQuery]   = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = HORSES.filter(h => {
    const q = query.toLowerCase()
    const match = !q || h.name.toLowerCase().includes(q) || h.breed.toLowerCase().includes(q)
    const st = filter === 'all' || (filter === 'warn' && h.status === 'warn') || (filter === 'ok' && h.status === 'ok')
    return match && st
  })

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">{t('horses.title')}</h1>
          <p className="text-stone-500 text-sm">{HORSES.length} paarden · De Winning</p>
        </div>
        <Link href="/horses/new" className="btn-primary gap-2">
          <Plus size={20} /> {t('horses.new')}
        </Link>
      </div>

      {/* Search + filter */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            className="input pl-10"
            placeholder={`${t('common.search')} naam, ras…`}
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        {['all','ok','warn'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`btn-secondary min-h-[48px] px-4 text-sm gap-2 ${filter === f ? 'bg-stable-700 text-white border-stable-700' : ''}`}
          >
            {f === 'all'  && t('common.all')}
            {f === 'ok'   && <><CheckCircle size={15} className="text-green-600" /> Gezond ({HORSES.filter(h=>h.status==='ok').length})</>}
            {f === 'warn' && <><AlertTriangle size={15} className="text-amber-600" /> Aandacht ({HORSES.filter(h=>h.status==='warn').length})</>}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((h, i) => {
          const [bg, tc] = AVATARS[i % AVATARS.length]
          return (
            <Link key={h.id} href={`/horses/${h.id}`} className="card hover:shadow-md hover:border-stable-300 transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-base font-bold flex-shrink-0"
                  style={{ background: bg, color: tc }}>
                  {h.name.slice(0,2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-stone-800 text-base truncate">{h.name}</p>
                  <p className="text-xs text-stone-500">{h.breed} · {h.sex === 'mare' ? t('horses.mare') : h.sex === 'stallion' ? t('horses.stallion') : t('horses.gelding')}</p>
                </div>
                <span className={h.status === 'ok' ? 'badge-ok' : 'badge-warn'}>
                  {h.status === 'ok' ? t('horses.excellent') : t('horses.attention')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs border-t border-stone-100 pt-3">
                <div><p className="text-stone-400">{t('horses.age')}</p><p className="font-medium text-stone-700">{h.age} {t('horses.years')}</p></div>
                <div><p className="text-stone-400">{t('horses.boxNumber')}</p><p className="font-medium text-stone-700">{h.box}</p></div>
                <div><p className="text-stone-400">{t('horses.color')}</p><p className="font-medium text-stone-700">{h.color}</p></div>
                <div><p className="text-stone-400">{t('horses.weightKg')}</p><p className="font-medium text-stone-700">{h.w} kg</p></div>
              </div>

              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-stone-100 text-xs text-stone-500">
                <span className="flex-1 truncate">🏇 {h.discipline}</span>
                <span className={`flex-shrink-0 ${new Date(h.vet.replace(/(\d+) (\w+) (\d+)/, '$3-$2-$1')) < new Date('2026-06-01') ? 'text-amber-600 font-medium' : ''}`}>
                  🩺 {h.vet}
                </span>
              </div>
            </Link>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-stone-500">{t('common.noResults')}</div>
      )}
    </div>
  )
}
