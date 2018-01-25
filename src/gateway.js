import Peer from 'peerjs'
import { PEER_HOST, PEER_PORT, PEER_PATH } from './config'

export default class Gateway {
    MESSAGE_TYPE = {
        HELLO: 'HELLO',
        POSITION: 'POSITION',
        FIRE: 'FIRE'
    }

    peer = null
    peerId = null
    peers = {}
    listeners = []

    constructor() {
        this.peer = new Peer({
            host: PEER_HOST,
            port: PEER_PORT,
            path: PEER_PATH
        })
        this.peer.on('open', id => {
            this.peerId = id
            console.log('Connected to server with peer id: ' + id)
            this.connectPlayers()
        })

        this.peer.on('connection', connection => {
            console.log('new connection')
            connection.on('data', data => {
                const type = this.MESSAGE_TYPE[data.type]
                if (!type) {
                    console.err('Message unknown: ' + data)
                    return
                }
                this.onData(type, data)
            })
            connection.on('close', () => {
                console.log('Connection closed')
            })
        })

        this.on(this.MESSAGE_TYPE.HELLO, data => this.handleHello(data))
    }

    connectPlayer(id) {
        if (!this.peers.hasOwnProperty(id)) {
            this.peers[id] = this.peer.connect(id)
        }
        this.sendData(id, this.MESSAGE_TYPE.HELLO)
        console.log('connecting to peer ' + id)
    }

    async connectPlayers() {
        const response = await fetch(
            `${
                window.location.protocol
            }//${PEER_HOST}:${PEER_PORT}${PEER_PATH}/peerjs/peers`
        )
        const players = await response.json()

        players.forEach(player => {
            if (player === this.peerId) {
                return
            }
            this.connectPlayer(player)
        })
    }

    onData(messageType, data) {
        this.listeners.forEach(listener => {
            if (listener.messageType === messageType) {
                listener.callback(data)
            }
        })
    }

    handleHello(data) {
        console.log('hello from: ' + data.id)
        this.connectPlayer(data.id)
    }

    sendData(id, messageType, data) {
        const peer = this.peers[id]
        if (peer == null) {
            console.log('Peer id invalid: ' + id)
        }
        peer.send({
            ...data,
            id: this.peerId,
            type: messageType
        })
    }

    broadcast(messageType, data) {
        Object.keys(this.peers).forEach(peerId => {
            this.sendData(peerId, messageType, data)
        })
    }

    on(messageType, callback) {
        this.listeners.push({
            messageType,
            callback
        })
    }
}
