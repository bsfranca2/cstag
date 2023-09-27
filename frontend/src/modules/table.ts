import { useWindowSize } from '@vueuse/core'
import { computed } from 'vue'

const defaultHeight = 545

export function useTable() {
  const { height } = useWindowSize()
  console.log('window size', height)
  const viewportHeight = computed(() => height.value * 0.8)
  const heightFinal = computed(() => {
    return defaultHeight > viewportHeight.value ? defaultHeight : viewportHeight
  })
  return { maxHeight: heightFinal }
}

