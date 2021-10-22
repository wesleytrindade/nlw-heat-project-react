import styles from './styles.module.scss';
interface LoadingProps{
    loadingType:string
}

export function Loading({loadingType}:LoadingProps){
    return(
        loadingType == 'spinLoading' ?
        <div className={styles.spinLoading}/> :
        <div><p>Carregando...</p></div>
    )
}