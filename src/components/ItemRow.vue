<script setup lang="ts">
import { ref } from 'vue'
import draggable from 'vuedraggable'

import ItemTile from '@/components/ItemTile.vue'

import type { Item } from '@/interfaces/tierlist'

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
    class="flex flex-wrap w-full min-h-16 bg-gray-700"
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
