import React, { useState } from "react"
import {
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  NativeSelect
} from "@mui/material"

const itemsPerPageOptions = [5, 10, 25, 50]

const CustomPagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  onItemsPerPageChange
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const handlePageChange = (event, page) => {
    onPageChange(page)
  }

  const handleItemsPerPageChange = (event) => {
    const newItemsPerPage = parseInt(event.target.value, 10)
    onItemsPerPageChange(newItemsPerPage)
  }

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "space-around",
        marginTop: "10px",
        alignItems: "center",
        flexWrap: "wrap"
      }}
    >
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        showFirstButton
        showLastButton
        siblingCount={1}
      />
      <FormControl
        sx={{ display: "flex", alignItems: "center", flexDirection: "row" }}
      >
        <Typography
          variant="body2"
          component={"p"}
          sx={{ marginRight: "10px" }}
        >
          Rows per page:{" "}
        </Typography>
        <NativeSelect
          sx={{ width: "auto" }}
          value={itemsPerPage}
          id="pageination"
          onChange={handleItemsPerPageChange}
          inputProps={{
            name: "age",
            id: "uncontrolled-native"
          }}
        >
          {itemsPerPageOptions.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </NativeSelect>
        {/* <Select
          sx={{ width: "auto" }}
          value={itemsPerPage}
          id="pageination"
          onChange={handleItemsPerPageChange}
        >
          {itemsPerPageOptions.map((option) => (
            <MenuItem className="red" key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select> */}
      </FormControl>
    </div>
  )
}

export default CustomPagination
