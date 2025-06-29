<script setup lang="ts">
import { useTemplateRef, onMounted, watch, onUnmounted } from 'vue'
import { onClickOutside } from '@vueuse/core'

const show = defineModel()

// When clicked outside the modal
const target = useTemplateRef<HTMLElement>('modal')
onClickOutside(target, () => {
  closeModal()
})

// When the following keys are pressed
function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && show.value) {
    closeModal()
  }
}

// Close the modal
function closeModal() {
  if (show.value) {
    show.value = false
  }
}

// Disable/enable scrolling when modal is shown/hidden
watch(show, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <div v-if="show" class="w-screen h-screen fixed top-0 left-0 bg-black/50 z-20">
    <div ref="modal">
      <slot />
    </div>
  </div>
</template>
