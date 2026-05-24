import { useI18n } from '../contexts/I18nContext'
import Link from 'next/link'
import {
  Trophy, Users, HeartPulse, DollarSign, CalendarDays,
  CheckSquare, AlertTriangle, TrendingUp, TrendingDown,
  Hammer, Syringe, Pill, ChevronRight
} from 'lucide-react'

const KPI = ({ label, value, sub, subColor, icon: Icon, iconColor }) => (
  <div className="kpi-card">
    <div className="flex items-center justify-between mb-2">
      <p className="text-xs font-medium text-stone-500 uppercase tracking-wide">{label}</p>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconColor}`}>
        <Icon size={18} strokeWidth={1.8} />
      </div>
    </div>
    <p className="text-3xl font-semibold text-stone-800">{value}</p>
    {sub && <p className={`text-xs mt-1 ${subColor || 'text-stone-500'}`}>{sub}</p>}
  </div>
)

const QuickLink = ({ href, icon: Icon, label, color }) => (
  <Link href={href} className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all active:scale-95 min-h-[90px] ${color}`}>
    <Icon size={28} strokeWidth={1.6} />
    <span className="text-sm font-semibold text-center leading-tight">{label}</span>
  </Link>
)

export default function Dashboard() {
  const { t } = useI18n()

  const urgent = [
    { icon: Hammer,  col: 'text-amber-600 bg-amber-50',  horse: 'Maximus', what: 'Hoefsmid',  when: '30 mei', days: 5  },
    { icon: Syringe, col: 'text-blue-600 bg-blue-50',    horse: 'Orion',   what: 'Vaccinatie',when: '1 jun',  days: 7  },
    { icon: Pill,    col: 'text-purple-600 bg-purple-50', horse: 'Bravo',   what: 'GastroGuard eindigt', when: '29 mei', days: 4 },
    { icon: Syringe, col: 'text-red-600 bg-red-50',      horse: 'Daydream',what: 'Vaccinatie achterstallig', when: '10 mei', days: -15 },
  ]

  const recentCare = [
    { icon: Hammer,  bg: 'bg-amber-100', ic: 'text-amber-700', horse: 'Sultan',  act: 'Hoefbehandeling', who: 'Pierre Desmet',  when: 'vandaag' },
    { icon: Syringe, bg: 'bg-blue-100',  ic: 'text-blue-700',  horse: 'Nova',    act: 'Vaccinatie influenza', who: 'Dr. Maes', when: 'gisteren' },
    { icon: Pill,    bg: 'bg-purple-100',ic: 'text-purple-700',horse: 'Bravo',   act: 'GastroGuard dag 22', who: 'Lien J.',    when: 'gisteren' },
    { icon: Pill,    bg: 'bg-purple-100',ic: 'text-purple-700',horse: 'Orion',   act: 'GastroGuard dag 11', who: 'Lien J.',    when: '23 mei' },
  ]

  return (
    <div className="space-y-6">

      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-stone-800">{t('dashboard.greeting')} 👋</h1>
        <p className="text-stone-500 text-sm mt-1">Zondag 25 mei 2026 · De Winning, Wuustwezel</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPI label={t('dashboard.totalHorses')}   value="12" sub="↑ 2 dit jaar" subColor="text-green-600" icon={Trophy}      iconColor="bg-stable-100 text-stable-700" />
        <KPI label={t('dashboard.healthAlerts')}  value="4"  sub="2 dringend"   subColor="text-red-600"   icon={HeartPulse} iconColor="bg-red-100 text-red-600" />
        <KPI label={t('dashboard.monthlyIncome')} value="€8.240" sub="↑ 12% vs apr" subColor="text-green-600" icon={TrendingUp}  iconColor="bg-green-100 text-green-600" />
        <KPI label={t('dashboard.monthlyCosts')}  value="€5.870" sub="↑ 8% vs apr"  subColor="text-red-600"   icon={TrendingDown} iconColor="bg-orange-100 text-orange-600" />
      </div>

      {/* Quick links — large touch-friendly buttons */}
      <div>
        <h2 className="section-title">{t('common.actions')}</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          <QuickLink href="/horses/new"    icon={Trophy}        label={t('horses.new')}         color="border-stable-200 bg-stable-50 text-stable-700 hover:bg-stable-100" />
          <QuickLink href="/grooms/new"    icon={Users}        label={t('grooms.new')}          color="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100" />
          <QuickLink href="/health"        icon={HeartPulse}   label={t('health.newTreatment')} color="border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100" />
          <QuickLink href="/finance"       icon={DollarSign}   label={t('finance.newTransaction')} color="border-green-200 bg-green-50 text-green-700 hover:bg-green-100" />
          <QuickLink href="/tasks"         icon={CheckSquare}  label={t('schedule.newTask')}    color="border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100" />
          <QuickLink href="/schedule"      icon={CalendarDays} label={t('schedule.newShift')}   color="border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Urgent actions */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title mb-0 flex items-center gap-2 text-red-700">
              <AlertTriangle size={18} />
              {t('dashboard.urgentActions')}
            </h2>
          </div>
          <div className="space-y-1">
            {urgent.map((u, i) => {
              const Icon = u.icon
              const overdue = u.days < 0
              return (
                <div key={i} className="table-row">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${u.col}`}>
                    <Icon size={18} strokeWidth={1.8} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-stone-800">{u.horse} — {u.what}</p>
                    <p className="text-xs text-stone-500">{u.when}</p>
                  </div>
                  <span className={`pill text-xs flex-shrink-0 ${overdue ? 'badge-danger' : u.days <= 5 ? 'badge-warn' : 'badge-ok'}`}>
                    {overdue ? `${Math.abs(u.days)}d te laat` : `${u.days}d`}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent care */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title mb-0">{t('dashboard.recentCare')}</h2>
            <Link href="/health/history" className="text-xs text-stable-600 hover:underline flex items-center gap-1">
              Alles <ChevronRight size={14} />
            </Link>
          </div>
          <div className="space-y-1">
            {recentCare.map((c, i) => {
              const Icon = c.icon
              return (
                <div key={i} className="table-row">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${c.bg}`}>
                    <Icon size={18} strokeWidth={1.8} className={c.ic} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-stone-800">{c.horse} — {c.act}</p>
                    <p className="text-xs text-stone-500">{c.who}</p>
                  </div>
                  <span className="text-xs text-stone-400 flex-shrink-0">{c.when}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

    </div>
  )
}
