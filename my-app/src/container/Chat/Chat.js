import React from 'react'
import { List, InputItem } from 'antd-mobile'

import { connect } from 'react-redux'
import { getMsgList, sendMsg, recvMsg } from '../../redux/chat.redux'
import io from 'socket.io-client'
const socket = io('ws://localhost:9093')

class Chat extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            text: '',
            msg: []
        }
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    state = {}

    handleSubmit() {
        // socket.emit('sendMsg', { text: this.state.text })
        const from = this.props.user._id;
        const to = this.props.match.params.user
        const msg = this.state.text
        this.setState({ text: '' })

        console.log({
            from,
            to,
            msg
        })
        this.props.sendMsg({
            from,
            to,
            msg
        })
    }
    componentDidMount() {
        this.props.getMsgList()
        this.props.recvMsg()
        // socket.on(
        //     'recvMsg',
        //     function(data) {
        //         this.setState({
        //             msg: [...this.state.msg, data.text]
        //         })
        //     }.bind(this)
        // )
    }
    render() {
        return (
            <div>
                {this.state.msg.map(v => {
                    return <p key={v}>{v}</p>
                })}
                <div className="stick-footer">
                    <List>
                        <InputItem
                            placeholder="Please enter"
                            value={this.state.text}
                            onChange={v => {
                                this.setState({
                                    text: v
                                })
                            }}
                            extra={
                                <span
                                    onClick={() => {
                                        this.handleSubmit()
                                    }}
                                >
                                    Submit
                                </span>
                            }
                        />
                    </List>
                </div>
            </div>
        )
    }
}
Chat = connect(
    state => state,
    {
        getMsgList,
        sendMsg,
        recvMsg
    }
)(Chat)
export default Chat
