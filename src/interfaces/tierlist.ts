export interface Item {
  id: number
  name: string
  image: string
}

export interface Tier {
  id: number
  label: string
  colorHex: string
  items: Item[]
}

export interface TierList {
  id: number
  name: string
  description: string
  tiers: Tier[]
}
