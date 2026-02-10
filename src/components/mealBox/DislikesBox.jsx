import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import AppColors from "@helpers/AppColors";

const DislikesBox = ({ allDislikes, dislikesData, isExecutive=false }) => {

  const childToParentMap = new Map();
  dislikesData?.forEach((parent) => {
    parent?.childs?.forEach((child) => {
      childToParentMap.set(child?.title, parent?.title);
    });
  });

  const filteredDislikes = allDislikes?.filter((dislike) => {
    const parent = childToParentMap?.get(dislike);
    return !parent || !allDislikes?.includes(parent);
  });

  return (
    <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'end' }}>
      {filteredDislikes?.map((item) => {
        const parent = dislikesData?.find((d) => d?.title === item && d?.is_parent);
        const children = parent?.childs?.filter((child) => allDislikes?.includes(child?.title)) || [];
        const isParent = !!parent;

        if (isParent && children.length) {
          return (
            <Box
              key={item}
              sx={{
                display: 'flex',
                gap: '8px',
                border: `1px solid ${ isExecutive ? AppColors.primaryOrange:AppColors.primaryGreen}`,
                borderRadius: '20px',
                padding: '4px 6px',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'width 0.5s ease-in-out',
                overflow: 'hidden',

              }}
            >
              <Box
                sx={{
                  borderRadius: '20px',
                  textAlign: 'center',
                  color: 'white',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  alignItems: 'center'
                }}
              >
                <Typography fontWeight={400} fontSize={{ xs: 12, md: 15 }} color={'white'}
                  sx={{
                    bgcolor: AppColors.primaryGreen,
                    padding: '4px 8px',
                    borderRadius: '20px',

                  }} >{item}</Typography>
                {children.map((child) => (
                  <Typography fontWeight={400} key={child?.id} fontSize={{ xs: 12, md: 15 }}>{child?.title}</Typography>
                ))}
              </Box>
            </Box>
          );
        } else {
          return (
            <Box
              key={item}
              sx={{
                border: `1px solid ${ isExecutive ? AppColors.primaryOrange:AppColors.primaryGreen}`,
                borderRadius: '20px',
                textAlign: 'center',
                padding: '4px 10px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Typography fontWeight={400} fontSize={{ xs: 12, md: 15 }}>{item}</Typography>
            </Box>
          );
        }
      })}
    </Box>
  );
};

export default DislikesBox;