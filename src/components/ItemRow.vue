<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'

import ItemTile from '@/components/ItemTile.vue'

import type { Item } from '@/interfaces/tierlist'

// Dynamically import draggable component for performance
const draggable = defineAsyncComponent(() => import('vuedraggable'))
const drag = ref(false)

const items = defineModel<Item[]>({
  type: Array,
  required: true,
})

function onDeleteItem(id: string) {
  items.value = items.value.filter((item) => item.id !== Number(id))
  console.log(`Item with id ${id} deleted`)
}
</script>

<template>
  <draggable
    v-model="items"
    group="items"
    @start="drag = true"
    @end="drag = false"
    item-key="id"
    handle=".handle"
    class="flex flex-wrap min-h-20 bg-gray-700 border-black"
  >
    <template #item="{ element }">
      <ItemTile :item="element" @delete="onDeleteItem" />
    </template>
  </draggable>
</template>
