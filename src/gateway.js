import Peer from 'peerjs'
import { PEER_HOST, PEER_PORT, PEER_PATH } from './config'

export default class Gateway {
    ACTIONS = {
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
            console.log('Peer: ' + id)
            this.connectPeers()
        })

        this.peer.on('connection', connection => {
            connection.on('data', data => {
                const type = this.ACTIONS[data.action]
                if (!type) {
                    console.err('Invalid action: ' + data.action)
                    return
                }
                this.onData(type, data)
            })
            connection.on('close', () => {
                console.log('Connection closed by ' + connection.peer)
            })
            this.connectPeer(connection.peer)
        })
    }

    connectPeer(id) {
        if (this.peers.hasOwnProperty(id)) {
            return
        }

        console.log('Connecting to peer ' + id)
        this.peers[id] = this.peer.connect(id)
    }

    async connectPeers() {
        const response = await fetch(
            `${
                window.location.protocol
            }//${PEER_HOST}:${PEER_PORT}${PEER_PATH}/peerjs/peers`
        )
        const peers = await response.json()

        peers.forEach(peerId => {
            if (peerId === this.peerId) {
                return
            }
            this.connectPeer(peerId)
        })
    }

    onData(action, data) {
        this.listeners.forEach(listener => {
            if (listener.action === action) {
                listener.callback(data)
            }
        })
    }

    sendData(id, action, data = {}) {
        const peer = this.peers[id]
        if (peer == null) {
            console.err('Peer invalid: ' + id)
            return
        }
        peer.send({
            ...data,
            id: this.peerId,
            action
        })
    }

    broadcast(action, data) {
        Object.keys(this.peers).forEach(peerId => {
            this.sendData(peerId, action, data)
        })
    }

    on(action, callback) {
        this.listeners.push({
            action,
            callback
        })
    }
}
