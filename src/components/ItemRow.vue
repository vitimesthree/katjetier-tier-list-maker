<script setup lang="ts">
import draggable from 'vuedraggable'
import ItemTile from '@/components/ItemTile.vue'
</script>

<template>
  <draggable
    group="items"
    item-key="id"
    class="flex flex-wrap gap-4 w-full min-h-16 bg-gray-700"
    @start="drag = true"
    @end="drag = false"
  >
    <template #item="{ element: item }">
      <ItemTile :item="item" />
    </template>
  </draggable>
</template>
