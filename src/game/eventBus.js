// A minimal typed event bus so React (state/UI) and Phaser (world/characters)
// can talk to each other without being tightly coupled.
//
// React  -> bus.emit('agent-react', { type: 'correct' })   // commands the world
// Phaser -> bus.emit('node-selected', { index: 2 })        // reports back to React

class EventBus extends EventTarget {
  emit(type, detail) {
    this.dispatchEvent(new CustomEvent(type, { detail }))
  }
  on(type, handler) {
    const wrapped = (e) => handler(e.detail)
    this.addEventListener(type, wrapped)
    return () => this.removeEventListener(type, wrapped)
  }
}

export const bus = new EventBus()
