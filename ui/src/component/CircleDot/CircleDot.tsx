import styles from './CircleDot.module.css';

interface CircleDotProps {
  isActive: boolean;
}

function CircleDot({isActive}: CircleDotProps) {
  return <span className={`${isActive ? styles.dotActive : styles.dot}`} />;
}
export default CircleDot;
