import { useEffect } from "react";
import styles from "./style.module.scss";
import { combineClasses } from '../../helpers/CommonFunc'

export default function CustomDialog({ open, onClose, children, onCrossClick = () => { }, btnColor = 'white',extraSx={}, extraSxMain={} }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      // Add this to allow dropdowns to work
      document.body.style.position = "relative";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
    }
    
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
    };
  }, [open]);

  if (!open) return null;
  const classNameBtn = btnColor == 'black' ?
    combineClasses(styles.customDialogClose, styles.black) :
    btnColor == 'green' ?
      combineClasses(styles.customDialogClose, styles.green) :
      combineClasses(styles.customDialogClose)

  const handleOverlayClick = (e) => {
    // Only close if clicking directly on the overlay (not modal content)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.customDialogOverlay} style={{...extraSxMain}} onClick={handleOverlayClick}  id="custom-dialog-overlay">
      <div className={styles.customDialogContent} style={{...extraSx}} onClick={(e) => e.stopPropagation()}>
        <button className={classNameBtn} onClick={() => onCrossClick() ? onCrossClick() : onClose()}>×</button>
        {children}
      </div>
    </div>
  );
}