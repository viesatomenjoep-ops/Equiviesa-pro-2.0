import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.warn('⚠️ Missing Supabase environment variables! Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseAnon)

// ─── Horses ───────────────────────────────────────────────────────
export const horsesApi = {
  list: (stableId) =>
    supabase.from('horses').select('*').eq('stable_id', stableId).eq('status', 'active').order('name'),

  get: (id) =>
    supabase.from('horses').select(`
      *, horse_photos(*),
      hoof_treatments(* order by treatment_date.desc limit 1),
      dewormings(* order by treatment_date.desc limit 1),
      medications(* status=eq.active),
      vaccinations(* order by vaccination_date.desc)
    `).eq('id', id).single(),

  create: (data) => supabase.from('horses').insert(data).select().single(),
  update: (id, data) => supabase.from('horses').update(data).eq('id', id).select().single(),
  delete: (id) => supabase.from('horses').update({ status: 'archived' }).eq('id', id),
}

// ─── Grooms ───────────────────────────────────────────────────────
export const groomsApi = {
  list: (stableId) =>
    supabase.from('grooms').select(`*, groom_horse_assignments(horse_id, horses(name))`).eq('stable_id', stableId).order('first_name'),

  get: (id) =>
    supabase.from('grooms').select(`*, groom_horse_assignments(horse_id, horses(name, breed))`).eq('id', id).single(),

  create: (data) => supabase.from('grooms').insert(data).select().single(),
  update: (id, data) => supabase.from('grooms').update(data).eq('id', id).select().single(),

  assignHorse: (groomId, horseId) =>
    supabase.from('groom_horse_assignments').upsert({ groom_id: groomId, horse_id: horseId }),
  unassignHorse: (groomId, horseId) =>
    supabase.from('groom_horse_assignments').delete().eq('groom_id', groomId).eq('horse_id', horseId),
}

// ─── Health ───────────────────────────────────────────────────────
export const healthApi = {
  hoofTreatments: {
    list:   (stableId) => supabase.from('hoof_treatments').select('*, horses(name,breed)').eq('stable_id', stableId).order('next_due_date'),
    create: (data)     => supabase.from('hoof_treatments').insert(data).select().single(),
    update: (id, data) => supabase.from('hoof_treatments').update(data).eq('id', id).select().single(),
  },
  dewormings: {
    list:   (stableId) => supabase.from('dewormings').select('*, horses(name,breed)').eq('stable_id', stableId).order('next_due_date'),
    create: (data)     => supabase.from('dewormings').insert(data).select().single(),
  },
  medications: {
    list:   (stableId) => supabase.from('medications').select('*, horses(name,breed)').eq('stable_id', stableId).order('start_date', { ascending: false }),
    active: (stableId) => supabase.from('medications').select('*, horses(name,breed)').eq('stable_id', stableId).eq('status', 'active'),
    create: (data)     => supabase.from('medications').insert(data).select().single(),
    update: (id, data) => supabase.from('medications').update(data).eq('id', id).select().single(),
    log:    (data)     => supabase.from('medication_logs').insert(data).select().single(),
  },
  vaccinations: {
    list:   (stableId) => supabase.from('vaccinations').select('*, horses(name,breed)').eq('stable_id', stableId).order('next_due_date'),
    create: (data)     => supabase.from('vaccinations').insert(data).select().single(),
  },
  dental: {
    list:   (stableId) => supabase.from('dental_checks').select('*, horses(name,breed)').eq('stable_id', stableId).order('next_due_date'),
    create: (data)     => supabase.from('dental_checks').insert(data).select().single(),
  },
  events: {
    list:   (horseId)  => supabase.from('health_events').select('*').eq('horse_id', horseId).order('event_date', { ascending: false }),
    create: (data)     => supabase.from('health_events').insert(data).select().single(),
  },
}

// ─── Finance ──────────────────────────────────────────────────────
export const financeApi = {
  transactions: {
    list: (stableId, from, to) =>
      supabase.from('financial_transactions')
        .select('*, horses(name), financial_categories(name,color,type)')
        .eq('stable_id', stableId)
        .gte('transaction_date', from)
        .lte('transaction_date', to)
        .order('transaction_date', { ascending: false }),
    create: (data) => supabase.from('financial_transactions').insert(data).select().single(),
  },
  categories: {
    list: (stableId) => supabase.from('financial_categories').select('*').eq('stable_id', stableId),
    create: (data) => supabase.from('financial_categories').insert(data).select().single(),
  },
}

// ─── Tasks ────────────────────────────────────────────────────────
export const tasksApi = {
  today: (stableId) =>
    supabase.from('tasks').select('*, horses(name), grooms(first_name,last_name)')
      .eq('stable_id', stableId)
      .eq('due_date', new Date().toISOString().split('T')[0])
      .order('priority'),
  list: (stableId, from, to) =>
    supabase.from('tasks').select('*, horses(name), grooms(first_name,last_name)')
      .eq('stable_id', stableId).gte('due_date', from).lte('due_date', to).order('due_date'),
  create: (data)  => supabase.from('tasks').insert(data).select().single(),
  complete: (id)  => supabase.from('tasks').update({ status: 'done', completed_at: new Date().toISOString() }).eq('id', id),
  update: (id, data) => supabase.from('tasks').update(data).eq('id', id).select().single(),
}

// ─── Shifts ───────────────────────────────────────────────────────
export const shiftsApi = {
  week: (stableId, from, to) =>
    supabase.from('shifts').select('*, grooms(first_name,last_name)').eq('stable_id', stableId)
      .gte('shift_date', from).lte('shift_date', to).order('shift_date'),
  create: (data) => supabase.from('shifts').insert(data).select().single(),
  delete: (id)   => supabase.from('shifts').delete().eq('id', id),
}
