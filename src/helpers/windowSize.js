const documentElement = document.documentElement
const body = document.getElementsByTagName('body')[0]
const x = window.innerWidth || documentElement.clientWidth || body.clientWidth
const y =
    window.innerHeight || documentElement.clientHeight || body.clientHeight

export default {
    x,
    y
}
