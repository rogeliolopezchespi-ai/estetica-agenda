import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const ULTRAMSG_INSTANCE = 'instance181178'
const ULTRAMSG_TOKEN = 'kjsckw9qcvwr4vjg'

export async function GET(request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== 'Bearer ' + process.env.CRON_SECRET) {
    return Response.json({ error: 'No autorizado' }, { status: 401 })
  }

  const manana = new Date()
  manana.setDate(manana.getDate() + 1)
  const fechaManana = manana.toISOString().split('T')[0]

  const { data: citas, error } = await supabase
    .from('citas')
    .select('*, estilistas(*)')
    .eq('fecha', fechaManana)
    .eq('estado', 'confirmada')

  if (error) return Response.json({ error: error.message }, { status: 500 })

  const resultados = []

  for (const cita of citas) {
    if (!cita.telefono) continue
    const telefono = '52' + cita.telefono.replace(/\D/g, '')
    const mensaje = `Hola ${cita.cliente.split(' ')[0]} 👋 Te recordamos tu cita de *${cita.servicio}* con *${cita.estilistas?.nombre}* mañana a las *${cita.hora}:00*. ✂️ Si necesitas cancelar avísanos con tiempo. ¡Te esperamos!`

    const res = await fetch(`https://api.ultramsg.com/${ULTRAMSG_INSTANCE}/messages/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ token: ULTRAMSG_TOKEN, to: telefono, body: mensaje, priority: '10' })
    })

    const data = await res.json()
    resultados.push({ cliente: cita.cliente, telefono, status: data.sent })
  }

  return Response.json({ enviados: resultados.length, resultados })
}
