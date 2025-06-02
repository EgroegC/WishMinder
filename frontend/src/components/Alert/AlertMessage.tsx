import { Alert } from "@chakra-ui/react";

const AlertMessage = ({
  status,
  title,
  message,
}: {
  status: "info" | "warning" | "success" | "error";
  title?: string;
  message: string;
}) => {
  return (
    <div>
      <Alert.Root status={status}>
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>{title}</Alert.Title>
          <Alert.Description>{message}</Alert.Description>
        </Alert.Content>
      </Alert.Root>
    </div>
  );
};

export default AlertMessage;
