import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CfnOutput, Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export interface DocsStackProps extends StackProps {
  zoneId: string;
  zoneName: string;
  domainName: string;
  /** Exact OIDC `sub` the deploy role trusts (GitHub immutable format; see infra/README.md). */
  githubOidcSubject: string;
  /** true: create the GitHub OIDC provider. false (default): import the existing one by ARN. */
  createOidcProvider: boolean;
}

export class DocsStack extends Stack {
  constructor(scope: Construct, id: string, props: DocsStackProps) {
    super(scope, id, props);

    const zone = route53.HostedZone.fromHostedZoneAttributes(this, 'Zone', {
      hostedZoneId: props.zoneId,
      zoneName: props.zoneName,
    });

    const bucket = new s3.Bucket(this, 'SiteBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      versioned: true,
      removalPolicy: RemovalPolicy.RETAIN,
      lifecycleRules: [{ noncurrentVersionExpiration: Duration.days(30) }],
    });

    const certificate = new acm.Certificate(this, 'Certificate', {
      domainName: props.domainName,
      validation: acm.CertificateValidation.fromDns(zone),
    });

    const rewrite = new cloudfront.Function(this, 'RewriteFunction', {
      code: cloudfront.FunctionCode.fromFile({ filePath: path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'functions', 'rewrite.js') }),
      runtime: cloudfront.FunctionRuntime.JS_2_0,
      comment: 'Rewrite directory and extensionless URIs to index.html',
    });

    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      comment: 'Scenery docs',
      defaultRootObject: 'index.html',
      domainNames: [props.domainName],
      certificate,
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(bucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        compress: true,
        functionAssociations: [{ function: rewrite, eventType: cloudfront.FunctionEventType.VIEWER_REQUEST }],
      },
      // The bucket is private, so a missing key surfaces as 403 from S3.
      errorResponses: [
        { httpStatus: 403, responseHttpStatus: 404, responsePagePath: '/404.html', ttl: Duration.minutes(5) },
        { httpStatus: 404, responseHttpStatus: 404, responsePagePath: '/404.html', ttl: Duration.minutes(5) },
      ],
    });

    const recordTarget = route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution));
    const recordName = props.domainName.endsWith(`.${props.zoneName}`)
      ? props.domainName.slice(0, -(props.zoneName.length + 1))
      : props.domainName;
    new route53.ARecord(this, 'AliasA', { zone, recordName, target: recordTarget });
    new route53.AaaaRecord(this, 'AliasAAAA', { zone, recordName, target: recordTarget });

    // GitHub Actions deploy role (OIDC, main branch of the docs repo only).
    const providerHost = 'token.actions.githubusercontent.com';
    const provider = props.createOidcProvider
      ? new iam.OidcProviderNative(this, 'GithubOidc', {
          url: `https://${providerHost}`,
          clientIds: ['sts.amazonaws.com'],
        })
      : iam.OidcProviderNative.fromOidcProviderArn(
          this,
          'GithubOidc',
          `arn:${Stack.of(this).partition}:iam::${this.account}:oidc-provider/${providerHost}`,
        );

    const deployRole = new iam.Role(this, 'DeployRole', {
      description: 'GitHub Actions deploy role for the Scenery docs site',
      maxSessionDuration: Duration.hours(1),
      assumedBy: new iam.WebIdentityPrincipal(provider.oidcProviderArn, {
        StringEquals: {
          [`${providerHost}:aud`]: 'sts.amazonaws.com',
          [`${providerHost}:sub`]: props.githubOidcSubject,
        },
      }),
    });
    deployRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ['s3:PutObject', 's3:DeleteObject'],
        resources: [bucket.arnForObjects('*')],
      }),
    );
    deployRole.addToPolicy(
      new iam.PolicyStatement({ actions: ['s3:ListBucket'], resources: [bucket.bucketArn] }),
    );
    deployRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ['cloudfront:CreateInvalidation'],
        resources: [`arn:${this.partition}:cloudfront::${this.account}:distribution/${distribution.distributionId}`],
      }),
    );

    new CfnOutput(this, 'BucketName', { value: bucket.bucketName });
    new CfnOutput(this, 'DistributionId', { value: distribution.distributionId });
    new CfnOutput(this, 'DeployRoleArn', { value: deployRole.roleArn });
  }
}
