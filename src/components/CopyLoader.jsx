import styled from "styled-components";
import { Box, CircularProgress, Typography } from "@mui/material";

const LoaderContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  gap:10px;
`;

const CopyStatus = styled(Typography)`
  margin: 20px 0px;
  font-size: 16px;
  font-weight: 500;
`;

const CopyLoader = ({ isLoading, copyStatus }) => {
  if (!isLoading) return null;

  return (
    <LoaderContainer>
      <CircularProgress size={30} />
      <CopyStatus>{copyStatus}</CopyStatus>
    </LoaderContainer>
  );
};

export default CopyLoader;
