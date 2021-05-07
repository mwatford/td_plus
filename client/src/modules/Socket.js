export default class VueSocket {
  constructor(io) {
    this.socket = null
    this.io = io
  }
  connect(opt, fn) {
    if (!this.socket) {
      this.socket = this.io(
        process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:8000',
        opt
      )
    }
  }
  close() {
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
  }
  emit(name, data) {
    if (this.socket) {
      this.socket.emit(name, data)
    }
  }
  on(name, fn) {
    this.socket.on(name, fn)
  }
  get instance() {
    return this.socket
  }
}
