import { Text } from "@chakra-ui/react";

const ErrorMessage = ({ message }: { message: string }) => {
  return (
    <div>
      <Text color="red.500" textAlign="center" mt={4}>
        {message}
      </Text>
    </div>
  );
};

export default ErrorMessage;
