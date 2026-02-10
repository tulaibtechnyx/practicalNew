import React, { useState } from 'react';
import { Pagination, Select, MenuItem, FormControl, InputLabel, Box, Typography } from '@mui/material';

const itemsPerPageOptions = [5, 10, 25, 50];

const CustomPagination = ({ totalItems, itemsPerPage, currentPage, onPageChange, onItemsPerPageChange, rowsPerPageBool=true , customSx={} }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (event, page) => {
    onPageChange(page);
  };

  const handleItemsPerPageChange = (event) => {
    const newItemsPerPage = parseInt(event.target.value, 10);
    onItemsPerPageChange(newItemsPerPage);
  };

  return (
    <div style={{width:'100%', display:'flex', justifyContent:'space-around', marginTop:'10px', alignItems:'center', flexWrap: 'wrap'}}>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        showFirstButton
        showLastButton
        siblingCount={1}
        sx={{...customSx}}
      />
      {
        rowsPerPageBool &&
      <FormControl sx={{display:'flex', alignItems:'center', flexDirection:'row'}}>
          <Typography>Rows per page: </Typography>
          <Select sx={{width:'auto'}} value={itemsPerPage} onChange={handleItemsPerPageChange}>
            {itemsPerPageOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
      </FormControl>
      }
    </div>
  );
};

export default CustomPagination;
