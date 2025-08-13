export type UserSlime = { id: number; image: string; username: string }
export type User = UserSlime & {
  address?: { address: string; city: string; state: string }
  age: number
  company?: { name: string; title: string }
  email: string
  firstName: string
  lastName: string
  phone: string
}
