import { Box, Spinner, Text } from "@chakra-ui/react";

const LoadingIndicator = () => {
  return (
    <div>
      <Box textAlign="center" mt={4}>
        <Spinner size="lg" color="blue.500" />
        <Text mt={2}>Loading data...</Text>
      </Box>
    </div>
  );
};

export default LoadingIndicator;
