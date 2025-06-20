export interface Item {
  id: number
  label: string
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
