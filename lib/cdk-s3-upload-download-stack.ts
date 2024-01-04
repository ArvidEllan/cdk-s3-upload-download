import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { StackProps } from 'aws-cdk-lib';
import { aws_apigateway as apigw } from "aws-cdk-lib";
import { aws_iam as iam } from "aws-cdk-lib";
import {aws_s3 as s3} from "aws-cdk-lib";
import { PassthroughBehavior } from 'aws-cdk-lib/aws-apigateway';

export class CdkS3UploadDownloadStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    //REST API
    const restApi = new apigw.RestApi(this, 'S3ObjectsApi', {
      restApiName: 'S3ObjectsApi',
      description: 'S3ObjectsApi',
      endpointConfiguration: {
        types: [apigw.EndpointType.EDGE]
        },
        binaryMediaTypes : ['application/octet-stream', 'image/jpeg']
        });
        const s3Bucket = new s3.Bucket(this, 'S3Bucket', {
          bucketName: 'my-storage-bucket-cdk',
          publicReadAccess : true,
          removalPolicy: cdk.RemovalPolicy.DESTROY
          })

          //API resource to list objects of a given bucket
          const bucketResource = restApi.root.addResource(myBucket.bucketName);

          //item API to r,w an object in a given bucket
          const bucketItemResource = bucketResource.addResource("{item}");

          //IAM Role for API GW
          this.apiGatewayRole = new iam.Role(this , 'api-gateway-role', {
            assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
           // managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess')]
          });

          //list all my buckets method
          this.addActionToPolicy("s3:ListAllMyBuckets");
          const listMyBucketsIntegration = new.apigw.AwsIntegration ({
            service : "s3",
            region : "us-east-1",
            path : '/',
            integrationHttpMethod : "GET",
            options: {
              credentialsRole: this.apiGatewayRole,
              PassthroughBehavior: apigw.PassthroughBehavior.WHEN_NO_TEMPLATES,
              integrationResponses:
              [{
                statusCode: '200',
                responseParameters: {'method.response.header.Content-Type:  "integration.response.header.Content-Type",}
              }]
            }
          });
        




          }
      }
    
   
  


