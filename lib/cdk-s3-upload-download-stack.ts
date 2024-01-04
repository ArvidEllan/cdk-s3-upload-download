import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { StackProps } from 'aws-cdk-lib';
import { aws_apigateway as apigw } from "aws-cdk-lib";
import { aws_iam as iam } from "aws-cdk-lib";
import {aws_s3 as s3} from "aws-cdk-lib";;

export class CdkS3Stack extends cdk.Stack {

  public readonly apiGatewayRole: iam.Role;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    
    //Create REST API
    const restApi = new apigw.RestApi(this, 'S3ObjectsApi', {
      restApiName: 'S3 Proxy Service',
      description: "S3 Actions Proxy API",
      endpointConfiguration: {
        types: [apigw.EndpointType.EDGE]
      },
      binaryMediaTypes: ['application/octet-stream', 'image/jpeg']
    });

    const myBucket = new s3.Bucket(this, 'MyBucket', {
      bucketName: 'my-storage-bucket-cdk',
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    //Create {folder} API resource to list objects in a given bucket
    const bucketResource = restApi.root.addResource(myBucket.bucketName);

    //Create {item} API resource to read/write an object in a given bucket
    const bucketItemResource = bucketResource.addResource("{item}");

    // Create IAM Role for API Gateway
    this.apiGatewayRole = new iam.Role(this, 'api-gateway-role', {
      assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com')
    });

    //ListAllMyBuckets method
    this.addActionToPolicy("s3:ListAllMyBuckets");
    const listMyBucketsIntegration = new apigw.AwsIntegration({
      service: "s3",
      region: "us-east-1",
      path: '/',
      integrationHttpMethod: "GET",
      options: {
        credentialsRole: this.apiGatewayRole,
        passthroughBehavior: apigw.PassthroughBehavior.WHEN_NO_TEMPLATES,
        integrationResponses: [{
          statusCode: '200',
          responseParameters: { 'method.response.header.Content-Type': 'integration.response.header.Content-Type'}
        }]        
      }
    });
    


