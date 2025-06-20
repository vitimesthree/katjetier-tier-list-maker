<script setup lang="ts">
import type { Item } from '@/interfaces/tierlist'

defineProps<{
  item: Item
}>()
</script>

<template>
  <div class="flex justify-center items-center size-16 border">
    <img :src="item.image" :alt="item.label" class="size-12 object-cover" />
  </div>
</template>
