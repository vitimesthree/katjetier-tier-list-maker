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
</script>

<template>
  <draggable
    v-model="items"
    group="items"
    item-key="id"
    class="flex flex-wrap min-h-20 bg-gray-700 border-black"
    @start="drag = true"
    @end="drag = false"
    handle=".handle"
  >
    <template #item="{ element: item, index }">
      <ItemTile
        :item="item"
        @update:label="(val) => (items[index].label = val)"
        @update:image="(val) => (items[index].image = val)"
      />
    </template>
  </draggable>
</template>
