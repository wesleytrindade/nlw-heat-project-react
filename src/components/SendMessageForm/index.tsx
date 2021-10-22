import { FormEvent, useContext, useState } from "react";
import { VscGithubInverted, VscSignOut } from "react-icons/vsc";
import { AuthContext } from "../../contexts/auth";
import { api } from "../../services/api";
import styles from "./styles.module.scss";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function SendMessageForm() {

    const { user, signOut } = useContext(AuthContext);

    const [message, setMessage] = useState("");

    async function handleSendMessage(event: FormEvent) {

        event.preventDefault();
        if (!message.trim()) {
            return;
        }

        try {
            await api.post("messages", { message });

            toast.success("Mensagem enviada com sucesso!", { autoClose: 3000 });
            setMessage("");
        }

        catch(err:any){
            toast.error(`Erro ao enviar a mensagem: ${err.message}`,{autoClose:3000})
        }

    }
    return (
        <>
            <div className={styles.sendMessageFormWrapper}>
                <button className={styles.signOutButton} onClick={signOut}>
                    <VscSignOut size={32} />
                </button>

                <header className={styles.userInformation}>
                    <div className={styles.userImage}>
                        <img src={user?.avatar_url} alt={user?.name}></img>
                    </div>

                    <strong className={styles.userName}>{user?.name}</strong>
                    <span className={styles.userGithub}>
                        <VscGithubInverted size={16} />
                        {user?.login}
                    </span>
                </header>

                <form onSubmit={handleSendMessage} className={styles.sendMessageForm}>
                    <label htmlFor="message">Mensagem</label>
                    <textarea
                        name="message"
                        id="message"
                        onChange={event => setMessage(event.target.value)}
                        value={message}
                        placeholder="Qual a sua expectativa para o evento?"
                    ></textarea>

                    <button type="submit">Enviar mensagem</button>
                </form>
            </div>

            <ToastContainer />
        </>
    )
}