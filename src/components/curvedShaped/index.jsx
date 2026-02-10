import styles from './style.module.scss'
import { Box } from '@mui/material'
const CurvedShaped = ({imgURL = ''}) => {
    return (
        <Box style={{ backgroundImage: `url(${imgURL})` }} className={styles.bgImageBottom}>
            {/* <img src={`${matches ?'/images/bg/banner-bottom-mob.png' : '/images/bg/banner-bottom.png'}`} /> */}
        </Box>
    )
}

export default CurvedShaped