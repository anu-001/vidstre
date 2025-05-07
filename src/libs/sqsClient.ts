import { DeleteMessageCommand, SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { SQS_QUEUE_URL, SQS_MESSAGE_DELAY } from "src/utils/env";

const client = new SQSClient({});

export const sendSQSMessage = async (message: any) => {
  const command = new SendMessageCommand({
    QueueUrl: SQS_QUEUE_URL,
    DelaySeconds: parseInt(SQS_MESSAGE_DELAY ?? '0'),
    MessageBody: JSON.stringify(message),
  });
  const response = await client.send(command);
  return response;
};

export const deleteSQSMessage = async (receiptHandle: string) => {
  const command = new DeleteMessageCommand({
    QueueUrl: SQS_QUEUE_URL,
    ReceiptHandle: receiptHandle,
  });
  const response = await client.send(command);
  return response;
}