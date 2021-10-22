import styles from './style.module.scss';
import logoImg from '../../../assets/logo.svg';
import { api } from '../../services/api';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Loading } from '../Loading';

const socket = io('http://localhost:4000');

interface Message {
    id: string;
    text: string;
    user: {
        name: string,
        avatar_url: string
    }
}

const messageQueue: Message[] = [];
socket.on('new_message', (new_message: Message) => {
    messageQueue.push(new_message);
});

export function MessageList() {

    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        const timer = setInterval(() => {
            if (messageQueue.length > 0) {
                setMessages((prevState)=> [
                    messageQueue[0],
                    prevState[0],
                    prevState[1]
                ].filter(Boolean))

                messageQueue.shift();
            }
        }, 3000)
    }, [])

    useEffect(() => {
        api.get<Message[]>("messages/getmessages").then(response => {
            setMessages(response.data);
            setLoading(false);
        });
    }, []);

    return (
        <div className={styles.messageListWrapper}>
            <img src={logoImg} alt='DoWhile2021' />

            {loading ? <div className={styles.loading}> <Loading loadingType='spinLoading' /> </div> :
                <ul className={styles.messageList}>
                    {messages.map(message => {
                        return <li key={message.id} className={styles.message}>
                            <p className={styles.messageContent}>{message.text}</p>
                            <div className={styles.messageUser}>
                                <div className={styles.userImage}>
                                    <img src={message.user.avatar_url} alt={message.user.name} />
                                </div>
                                <span>{message.user.name}</span>
                            </div>
                        </li>
                    })}
                </ul>
            }
        </div>
    )
}