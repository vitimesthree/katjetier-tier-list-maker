<script setup lang="ts">
import { ref, onMounted } from 'vue'
import draggable from 'vuedraggable'
import ItemTile from '@/components/ItemTile.vue'
import IconMove from '@/components/icons/IconMove.vue'

import type { Item, Tier, TierList } from '@/interfaces/tierlist'

const itemDock = ref<Item[]>([
  { id: 1, name: 'Item 1', image: 'https://picsum.photos/300?random=1' },
  { id: 2, name: 'Item 2', image: 'https://picsum.photos/300?random=2' },
  { id: 3, name: 'Item 3', image: 'https://picsum.photos/300?random=3' },
])

const tiers = ref<Tier[]>([
  { id: 1, label: 'S', colorHex: '#f00', items: [] },
  { id: 2, label: 'A', colorHex: '#00f', items: [] },
  { id: 3, label: 'B', colorHex: '#0f0', items: [] },
  { id: 4, label: 'C', colorHex: '#ff0', items: [] },
  { id: 5, label: 'D', colorHex: '#808080', items: [] },
])

const tierLists = ref<TierList[]>([
  {
    id: 1,
    name: 'Tier List 1',
    description: 'Sample tier list for demonstration',
    tiers: tiers.value,
  },
])

const drag = ref(false)

// functions that mutate state and trigger updates
function addTier() {
  const newTier: Tier = {
    id: tiers.value.length + 1,
    label: 'New Tier',
    colorHex: '#fff',
    items: [],
  }
  tiers.value.push(newTier)
  console.log(`Added new tier: ${newTier.label}`)
  console.log(`Current tiers:`, tiers.value)
}

// lifecycle hooks
onMounted(() => {
  console.log(`Initial tiers:`, tiers.value)
})
</script>

<template>
  <main class="w-10/12 max-w-6xl m-auto">
    <h2>{{ tierLists[0].name }}</h2>
    <!-- Draggable tiers -->
    <draggable
      v-model="tiers"
      group="tiers"
      @start="drag = true"
      @end="drag = false"
      item-key="id"
      handle=".handle"
    >
      <template #item="{ element }">
        <div class="w-full flex">
          <div
            :style="{ backgroundColor: element.colorHex }"
            class="flex items-center text-lg font-bold border-r"
          >
            <IconMove class="handle" />
            <input v-model="element.label" />
          </div>
          <ul class="flex flex-wrap">
            <draggable
              v-model="element.items"
              group="items"
              item-key="id"
              class="flex flex-wrap gap-4"
              @start="drag = true"
              @end="drag = false"
              handle=".handle"
            >
              <template #item="{ element: item }">
                <li class="handle">
                  <ItemTile :item="item" />
                </li>
              </template>
            </draggable>
          </ul>
        </div>
      </template>
    </draggable>
    <button class="border p-2" @click="addTier">New Tier</button>
    <!-- Item dock -->
    <div class="flex flex-col gap-4">
      <ul class="flex flex-wrap">
        <draggable
          v-model="itemDock"
          group="items"
          item-key="id"
          class="flex flex-wrap gap-4"
          @start="drag = true"
          @end="drag = false"
          handle=".handle"
        >
          <template #item="{ element: item }">
            <li class="handle">
              <ItemTile :item="item" />
            </li>
          </template>
        </draggable>
      </ul>
    </div>
  </main>
</template>
