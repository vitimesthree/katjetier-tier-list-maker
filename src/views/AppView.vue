<script setup lang="ts">
import { ref, defineAsyncComponent, onMounted, onUnmounted } from 'vue'

import ItemRow from '@/components/ItemRow.vue'
import { EllipsisVertical } from 'lucide-vue-next'
import { templates } from '@/data/templates'

import type { Item, Tier, TierList } from '@/interfaces/tierlist'

// Seed 20 items for the item dock
const itemSeed = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  label: `Item ${i + 1}`,
  image: `https://picsum.photos/300?random=${i}`,
}))

// Initialize the data
const currentId = ref(0)
const data = ref<TierList[]>([
  {
    id: 0,
    name: 'Tier List 1',
    description: 'Sample tier list for demonstration',
    itemDock: ref<Item[]>(itemSeed),
    tiers: ref<Tier[]>(templates[1].tiers ?? []),
  },
])

// Dynamically import draggable component for performance
const draggable = defineAsyncComponent(() => import('vuedraggable'))
const drag = ref(false)

// functions that mutate state and trigger updates
function addTier() {
  const newTier: Tier = {
    id: data.value[currentId.value].tiers.length + 1,
    label: 'New Tier',
    colorHex: '#fff',
    items: [],
  }
  data.value[currentId.value].tiers.push(newTier)
  console.log(`Added new tier: ${newTier.label}`)
  console.log(`Current tiers:`, data.value[currentId.value].tiers)
}

function handlePaste(event: ClipboardEvent) {
  if (event.clipboardData) {
    // Get the items from the clipboard
    const items = event.clipboardData.items
    if (items) {
      // Loop through all items, looking for any kind of image
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          // Represent the image as a file,
          const blob = items[i].getAsFile()
          // Use URL or webkitURL to create a source
          const urlObj = window.URL || window.webkitURL
          const image = urlObj.createObjectURL(blob as Blob)

          // Create a new item with the image
          createItem('', image)
        }
      }
    }
  }
}

function createItem(label: string, image: string) {
  // Initialise a new item
  const newItem: Item = {
    id: data.value[currentId.value].itemDock.length + 1,
    label: label,
    image: image,
  }

  // Push it to the item dock
  itemDock.value.push(newItem)

  // Log the new item
  console.log(`Created new item: ${newItem.id}`)
  console.log(`Current item dock:`, data.value[currentId.value].itemDock)
}

async function exportToImage() {
  // Dynamically import html2canvas to only load it when needed
  console.log('Importing canvas library...')
  const { default: html2canvas } = await import('html2canvas-pro')

  // Render the selected area to a canvas
  console.log('Rendering capture area...')
  html2canvas(document.querySelector('#capture') as HTMLElement, {
    useCORS: true, // Temporary measure to allow cross-origin images
  }).then((canvas) => {
    // Append the canvas as an image
    document.body.appendChild(canvas)
    console.log('Image rendered')
  })
}

function exportToJson() {
  // Convert the data to JSON
  const jsonData = JSON.stringify(data.value, null, 2)

  // Create a Blob from the JSON data
  const blob = new Blob([jsonData], { type: 'application/json' })

  // Create a link element to download the Blob
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'tierlist.json'

  // Append the link to the body and trigger a click to download
  document.body.appendChild(link)
  link.click()

  // Clean up by removing the link
  document.body.removeChild(link)
  console.log('Exported to JSON:', jsonData)
}

function importFromJson(event: Event) {
  // Check if the event is a file input change
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    const file = input.files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        // Parse the JSON data
        const jsonData = JSON.parse(e.target?.result as string)
        // Update the data with the parsed JSON
        data.value = jsonData
        console.log('Imported from JSON:', jsonData)
      } catch (error) {
        console.error('Error parsing JSON:', error)
      }
    }
    reader.readAsText(file)
  } else {
    console.error('No file selected for import')
  }
}

// lifecycle hooks
onMounted(() => {
  console.log('App mounted')
  console.log('Listening for paste event')
  window.addEventListener('paste', handlePaste)
})
onUnmounted(() => {
  console.log('Removing paste event listener')
  window.removeEventListener('paste', handlePaste)
})
</script>

<template>
  <main class="w-10/12 max-w-6xl m-auto">
    <h2>{{ data[0].name }}</h2>
    <!-- Draggable tiers -->
    <div id="capture">
      <draggable
        v-model="data[currentId].tiers"
        group="tiers"
        @start="drag = true"
        @end="drag = false"
        item-key="id"
        handle=".handle"
      >
        <template #item="{ element }">
          <div class="w-full grid grid-cols-[auto,1fr] border border-black">
            <div
              :style="{ backgroundColor: element.colorHex }"
              class="max-w-16 grid grid-cols-[auto,1fr] items-center text-black text-lg font-bold"
            >
              <input v-model="element.label" />
              <EllipsisVertical class="handle" />
            </div>
            <!-- Item list-->
            <ItemRow v-model="element.items" />
          </div>
        </template>
      </draggable>
    </div>
    <button class="border p-2" @click="addTier">New Tier</button>
    <!-- Item dock -->
    <ItemRow v-model="data[currentId].itemDock" :draggable="drag" />
    <button class="border p-2" @click="exportToImage">Export to image</button>
    <label for="import-json" class="border p-2 cursor-pointer inline-block">Import</label>
    <input
      type="file"
      id="import-json"
      class="hidden border p-2"
      @change="importFromJson"
      accept=".json"
    />
    <button class="border p-2" @click="exportToJson">Export</button>
  </main>
</template>
