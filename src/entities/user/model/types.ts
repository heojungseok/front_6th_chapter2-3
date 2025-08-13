export type UserSlime = { id: number; username: string; image: string }
export type User = UserSlime & {
  firstName: string
  lastName: string
  age: number
  email: string
  phone: string
  address?: { address: string; city: string; state: string }
  company?: { name: string; title: string }
}
