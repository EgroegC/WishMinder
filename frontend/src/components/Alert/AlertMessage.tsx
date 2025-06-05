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
    <div style={{ maxWidth: "100%", overflow: "hidden" }}>
      <Alert.Root status={status}>
        <Alert.Indicator />
        <Alert.Content>
          {title && <Alert.Title>{title}</Alert.Title>}
          <Alert.Description
            whiteSpace="pre-wrap"
            wordBreak="break-word"
            overflowWrap="break-word"
          >
            {message}
          </Alert.Description>
        </Alert.Content>
      </Alert.Root>
    </div>
  );
};

export default AlertMessage;
