import { Box, Typography } from '@mui/material';
import CircularNumberSlider from '../../CircularNumberSlider/CircularNumberSlider';
import {  dfjac, snackBarText } from '../../popUp/commonSX';
import AppColors from '../../../helpers/AppColors';

const SliderQuestions = (props) => {
    const {
        AddItemType,
        snack = false,
        setMealSize,
        setMealsPerDay,
        setNoofSnackPerDay,
        MealSize,
        MealsPerDay,
        NoofSnackPerDay,
    } = props;
    return (
        <div>
            <Typography sx={{ textAlign: 'center', fontSize: {xs:'14px ',md:'22px'},  fontWeight: 500 }}>
                Step 1:
            </Typography>
            <Typography sx={{ textAlign: 'center', mt: '5px' ,fontSize: {xs:'14px ',md:'18px'}}}>
                Please confirm these details:
            </Typography>

            <Box sx={{ ...dfjac, gap: '10px', mt: '30px' }} >
                {
                    snack ?
                        <Box sx={sliderBoxSx} >
                            <CircularNumberSlider 
                            additems={true}
                            defaultVal={NoofSnackPerDay} max={5} onChange={(e) => { setNoofSnackPerDay(e) }} />
                            <Typography sx={{ ...snackBarText }} >200 calorie Snack(s)</Typography>
                        </Box>
                        :
                        <>
                            <Box sx={sliderBoxSx} >
                                <CircularNumberSlider
                                    additems={true}
                                    defaultVal={MealSize}
                                    values={[400, 500, 600, 700, 800]}
                                    color={AppColors.primaryGreen}
                                    onChange={(val) => setMealSize(val)}
                                />
                                <Typography sx={{ ...snackBarText }} >Meal Size</Typography>
                            </Box>
                            <Box sx={sliderBoxSx} >
                                <CircularNumberSlider 
                                additems={true}
                                defaultVal={MealsPerDay} color={AppColors.primaryGreen} max={5} onChange={(e) => { setMealsPerDay(e) }} />
                                <Typography sx={{ ...snackBarText, textWrap: 'wrap' }} >No of added meals per day</Typography>
                            </Box>
                        </>
                }
            </Box>
        </div>
    )
}

const sliderBoxSx = {
    maxWidth: '120px', minHeight: '170px'
}

export default SliderQuestions