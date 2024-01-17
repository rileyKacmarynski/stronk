/* eslint-disable no-undef */
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import { createClient } from '@supabase/supabase-js'
import { parse } from 'csv-parse'

dotenv.config()
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_KEY
)

const records = []
const parser = parse({
  delimiter: ',',
})

parser.on('readable', () => {
  let record
  let i = 0
  while ((record = parser.read()) !== null) {
    const [id, title, description, type, body_part, required_equipment] = record
    records.push({ id, title, description, type, body_part, required_equipment})
    // console.log(records[i])
    i++
  }
})

parser.on('error', (err) => {
  console.error(err.message)
})

parser.on('end', async function () {
  // remove header row
  records.shift()
  // console.log(records[0])
  const { error } = await supabase
    .from('staging_exercises')
    .insert(records)

  console.log(error)
})

const data = fs.readFileSync('/home/rkacmarynski/megaGymDataset.csv')
parser.write(data)
parser.end()

// const { data: stuff } = await supabase.from('staging_exercises').select('*')

// console.log(stuff)
