import { Box, Typography } from "@mui/material"
import AppColors from "helpers/AppColors"
import { useState, useEffect } from "react"

const OfflineNotifier = () => {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    function handleOffline() {
      setIsOnline(false)
    }

    function handleOnline() {
      setIsOnline(true)
    }

    window.addEventListener("offline", handleOffline )
    window.addEventListener("online", handleOnline )

    return () => {
      window.removeEventListener("offline", handleOffline )
      window.removeEventListener("online", handleOnline )
    }
  }, [])

  if (isOnline) {
    return null
  }

  return (
    <Box className="offline-ui offline-ui-down">
      <Typography variant="body3" color={AppColors.white}>
        You are currently offline. Please check your internet connection.
      </Typography>
    </Box>
  )
}

export default OfflineNotifier
