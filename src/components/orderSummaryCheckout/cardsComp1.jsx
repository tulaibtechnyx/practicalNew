import React, { useEffect } from "react"
import styles from "./style.module.scss"
import Typography from "@mui/material/Typography"
import Radio from "@mui/material/Radio"
import clsx from "clsx"
import FormControlLabel from "@mui/material/FormControlLabel"
import EditIcon from "../../../public/images/icons/edit-address.svg"
import AppDataConstant from "helpers/AppDataConstant"

export default function CardsComp({
  name,
  currentValue,
  card_number,
  id,
  onDelete,
  onEditPressHandler,
  brand,
  canEdit = true
}) {
  useEffect(() => {
    console.log("Thisi s current value=====", currentValue)
  }, [currentValue])
console.log("canEdit",canEdit)
  return (
    <div className="radioCard">
      <div className={styles.radio_btn}>
        <FormControlLabel
          checked={currentValue == id ? true : false}
          value={id}
          control={<Radio />}
        />
        <div className={clsx(styles.cardBoxBar, styles.sty2)}>
          <div className={styles.radio_content}>
            <div className={styles.cardLogo}>
              {brand === "Visa" ? (
                <img src={AppDataConstant.visaSm} />
              ) : brand === "MasterCard" ? (
                <img src={AppDataConstant.masterCard} />
              ) : null}
            </div>
            <Typography variant={"body3"}>{name}</Typography>
          </div>
          <div className={styles.cardEdit}>
            {
              canEdit&&
            <div className={styles.optionalIcon} onClick={onEditPressHandler}>
              <EditIcon />
            </div>
            }
            <div className={styles.cardNum}>
              <Typography variant={"body3"} className={styles.cardNumber}>
                {card_number}
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
