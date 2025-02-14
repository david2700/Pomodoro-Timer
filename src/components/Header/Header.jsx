import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.container}>
        <p className={styles.title}>Pomodoro</p>
        <div className={styles.buttons}>
            <button className={styles.button}>Report</button>
            <button className={styles.button}>Settings</button>
            <button className={styles.button}>A</button>
        </div>
    </header>
  )
}
