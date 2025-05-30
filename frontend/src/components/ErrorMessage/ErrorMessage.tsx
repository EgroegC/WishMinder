import { Alert } from "@chakra-ui/react";

const ErrorMessage = ({
  title,
  message,
}: {
  title?: string;
  message: string;
}) => {
  return (
    <div>
      <Alert.Root status="error">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>{title}</Alert.Title>
          <Alert.Description>{message}</Alert.Description>
        </Alert.Content>
      </Alert.Root>
    </div>
  );
};

export default ErrorMessage;
