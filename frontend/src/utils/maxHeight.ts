export default function() {
  const defaultHeight = 545
  const clientHeight = document.documentElement.clientHeight * 0.8
  return defaultHeight > clientHeight ? defaultHeight : clientHeight
}
