const { Stack, Duration, CfnOutput } = require('aws-cdk-lib');
const AWS = require('aws-sdk');
const lambda = require('aws-cdk-lib/aws-lambda');
const apigw = require('aws-cdk-lib/aws-apigateway');
const iam = require('aws-cdk-lib/aws-iam');
const cdk = require('aws-cdk-lib');
const ssm = require('aws-cdk-lib/aws-ssm');
const { Construct } =require('constructs');
const cognito = new AWS.CognitoIdentityServiceProvider({
  apiVersion: "2016-04-18",
});
class CenomiIntegrationCommonStack extends cdk.Stack {
  /**
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);
  


const lambdaRole = new iam.Role(this, `${props.resourcePrefix}LambdaRole`, {
  assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
  roleName: `${props.resourcePrefix}LambdaRole`,
});

lambdaRole.addManagedPolicy(
  iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole")
);
lambdaRole.addToPolicy(
  new iam.PolicyStatement({
    actions: ["cognito-idp:*"], 
    resources: ["*"], 
  })
);

lambdaRole.addToPolicy(
  new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    actions: ["s3:*"],
    resources: ["*"],
  })
);

lambdaRole.addToPolicy(
  new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    actions: ["dynamodb:*"],
    resources: ["*"],
  })
);

lambdaRole.addToPolicy(
  new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    actions: ["ssm:GetParameter"],
    resources: [
      "*",
    ],
  })
);

lambdaRole.addToPolicy(
  new iam.PolicyStatement({
    actions: ["sns:Publish"],
    resources: ["*"],
  })
);

lambdaRole.addToPolicy(
  new iam.PolicyStatement({
    actions: ["sqs:*"],
    resources: ["*"],
  })
);

lambdaRole.addToPolicy(
  new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    actions: ["es:*"],
    resources: ["*"],
  })
);

lambdaRole.addToPolicy(
  new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    actions: ["ssm:GetParameter"],
    resources: ["*"],
  })
);

lambdaRole.addToPolicy(
  new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    actions: ["ses:SendEmail", "ses:SendRawEmail"],
    resources: ["*"],
  })
);

//////////////////////////////////////////// API GATEWAY ////////////////////////////////////////////////////////////
 this.api = new apigw.RestApi(this, `${props.resourcePrefix}ApiGateway`, {
      binaryMediaTypes:["application/pdf"],
      defaultCorsPreflightOptions: {
          allowHeaders: [
              'Content-Type',
              'X-Amz-Date',
              'Authorization',
              'X-Api-Key',
          ],
          allowMethods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
          allowCredentials: true,
          allowOrigins: props.allowCrossOrigins,
      }
    });

    new CfnOutput(this, "CenomiAPIGatewayExport", {
      exportName: `cenomi-api-gateway-export`,
      value: this.api.restApiId
    });

    new CfnOutput(this, `CenomiAPIGatewayResourceExport`, {
      exportName: `cenomi-api-gateway-resource-export`,
      value: this.api.root.resourceId,
    });
  }
}

module.exports = { CenomiIntegrationCommonStack };
