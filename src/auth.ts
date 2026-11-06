export interface User {
  name: string
  studentId: string
  email: string
}

interface StoredUser extends User {
  passwordHash: string
  createdAt: string
}

const USERS_KEY = 'quickbite-users'
const USERS_BACKUP_KEY = 'quickbite-users-backup'
const SESSION_KEY = 'quickbite-session'

let memoryUsers: StoredUser[] = []

if (typeof navigator !== 'undefined' && navigator.storage?.persist) {
  navigator.storage.persist().catch(() => {})
}

function parseUsers(key: string): StoredUser[] | null {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return null
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}

function readUsers(): StoredUser[] {
  const primary = parseUsers(USERS_KEY)
  const backup = parseUsers(USERS_BACKUP_KEY)
  const best = [primary, backup, memoryUsers].reduce<StoredUser[]>(
    (a, b) => (b && b.length > a.length ? b : a),
    [],
  )
  if (best.length > (primary?.length ?? 0)) writeUsers(best)
  return best
}

function writeUsers(users: StoredUser[]) {
  memoryUsers = users
  const json = JSON.stringify(users)
  try { localStorage.setItem(USERS_KEY, json) } catch { /* storage unavailable */ }
  try { localStorage.setItem(USERS_BACKUP_KEY, json) } catch { /* storage unavailable */ }
}

async function hash(email: string, password: string) {
  const data = new TextEncoder().encode(`${email.toLowerCase()}::${password}`)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('')
}

const publicUser = ({ name, studentId, email }: StoredUser): User => ({ name, studentId, email })

export async function registerUser(input: User & { password: string }): Promise<{ user?: User; error?: string }> {
  const email = input.email.trim().toLowerCase()
  const users = readUsers()
  if (users.some(u => u.email === email)) return { error: 'An account with this email already exists. Please sign in.' }
  const stored: StoredUser = {
    name: input.name.trim(),
    studentId: input.studentId.trim().toUpperCase(),
    email,
    passwordHash: await hash(email, input.password),
    createdAt: new Date().toISOString(),
  }
  writeUsers([...users, stored])
  return { user: publicUser(stored) }
}

export async function authenticate(emailInput: string, password: string): Promise<{ user?: User; error?: string }> {
  const email = emailInput.trim().toLowerCase()
  const found = readUsers().find(u => u.email === email)
  if (!found) return { error: 'No account found for this email. Please sign up first.' }
  if (found.passwordHash !== (await hash(email, password))) return { error: 'Incorrect password. Please try again.' }
  return { user: publicUser(found) }
}

export function saveSession(user: User | null) {
  try {
    if (user) localStorage.setItem(SESSION_KEY, user.email)
    else localStorage.removeItem(SESSION_KEY)
  } catch { /* storage unavailable */ }
}

export function loadSession(): User | null {
  let email: string | null = null
  try { email = localStorage.getItem(SESSION_KEY) } catch { /* storage unavailable */ }
  const found = email ? readUsers().find(u => u.email === email) : undefined
  return found ? publicUser(found) : null
}

export const orderHistoryKey = (user: User | null) =>
  user ? `quickbite-order-history:${user.email}` : 'quickbite-order-history'
