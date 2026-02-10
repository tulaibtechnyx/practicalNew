import { useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import styles from './style.module.scss';

const CustomConfirmationModal = ({
  handleCancel = () => { },
  handleConfirm = () => { },
  open = false,
  modalTitle = '',
  modalDescription = '',
  onConfirmBtnTitle = 'Confirm',
  onCancelBtnTitle = 'Cancel',
  onlyConfirmationBtn = false,
  isLoading = false,
  modalColorType = 'green',
  variantCancel = 'outlined',
  variantConifrm = 'outlined',
  extraSx = {},
  modalDescriptionSx = {},
}) => {
  useEffect(() => {
    if (open) {
      document.body.classList.add("modalOpen")
    } else {
      document.body.classList.remove("modalOpen")
    }
  }, [open])


  return (
    <>
      <div className={`${styles.backdrop} ${open ? styles.open : ''}`}>
        <Box component={'div'} className={styles.modalWrapper} sx={{
          bgcolor: modalColorType == 'green' ? "#119a77 !important" : 'white !important',
          ...extraSx

        }}>
          <div className={styles.modalContent}>
            {modalTitle
              &&
              <Typography variant="h4" color={modalColorType == 'green' ? "white !important" : "#119a77 !important"} className={styles.modalTitle}>
                {modalTitle}
              </Typography>
            }
            <Typography variant="body3" color={modalColorType == 'green' ? "white !important" : "#000 !important"} className={styles.modalBody}
              sx={{ ...modalDescriptionSx }}
            >
              {modalDescription}
            </Typography>
            <div className={styles.buttonWrapper} style={{
              flexDirection: modalColorType == 'green' ? 'row' : 'column'
            }}>
              {
                !onlyConfirmationBtn &&
                <Button
                  variant={modalColorType == 'green' ? 'outlined' : variantCancel}
                  disabled={isLoading}
                  onClick={handleCancel}
                  color={"primary"}
                  sx={{
                    color: modalColorType == 'green' && 'white',
                    borderColor: modalColorType == 'green' && 'white',
                  }}
                  className={styles.button}
                >
                  {onCancelBtnTitle}
                </Button>
              }
              <Button
                variant={modalColorType == 'green' ? 'outlined' : variantConifrm}
                disabled={isLoading}
                onClick={handleConfirm}
                color="primary"
                autoFocus
                sx={{
                  color: modalColorType == 'green' && 'white',
                  borderColor: modalColorType == 'green' && 'white',
                }}
                className={styles.button}
              >
                {onConfirmBtnTitle}
              </Button>
            </div>
          </div>
        </Box>
      </div>
    </>
  );
};

export default CustomConfirmationModal;
