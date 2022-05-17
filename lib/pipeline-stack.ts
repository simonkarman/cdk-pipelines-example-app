import {pipelines, Stack, StackProps, Stage} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {ExampleAppStack} from './stacks/example-app-stack';

interface ExampleAppStageProps {
  readonly environmentName: string;
}

class ExampleAppStage extends Stage {
  constructor(scope: Construct, id: string, props: ExampleAppStageProps) {
    super(scope, id);

    new ExampleAppStack(this,  'ExampleAppStack', {
      stackName: `${props.environmentName}-example-app`,
      environmentName: props.environmentName,
    });
  }

}

export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
      synth: new pipelines.ShellStep('Synth', { commands: ['npm ci', 'npx cdk synth'] })
    })

    pipeline.addStage(new ExampleAppStage(this, 'Development', {
      environmentName: 'dev',
    }));

    pipeline.addStage(new ExampleAppStage(this, 'Production', {
      environmentName: 'prd',
    }), { pre: [
      new pipelines.ManualApprovalStep('Approve', { comment: 'Approve to deploy to the production environment.' }),
    ] });
  }
}