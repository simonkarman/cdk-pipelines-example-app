import {aws_iam, aws_kms, aws_sqs as sqs, Stack, StackProps} from 'aws-cdk-lib';
import { Construct } from 'constructs';

interface ExampleAppStackProps extends  StackProps {
  environmentName: string;
}

export class ExampleAppStack extends Stack {
  constructor(scope: Construct, id: string, props: ExampleAppStackProps) {
    super(scope, id, props);

    new sqs.Queue(this, 'Queue', {
      queueName: `${props.environmentName}-example-app-queue`,
      encryptionMasterKey: new aws_kms.Key(this, 'Key', {
        alias: `alias/${props.environmentName}-my-example-key`,
      })
    });
  }
}
