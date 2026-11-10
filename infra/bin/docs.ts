#!/usr/bin/env node
import { App } from 'aws-cdk-lib';
import { DocsStack } from '../lib/docs-stack.js';

const app = new App();
const need = (k: string): string => {
  const v = app.node.tryGetContext(k);
  if (!v || typeof v !== 'string') {
    throw new Error(`Missing CDK context "${k}". Pass -c ${k}=... or set it in the gitignored cdk.context.json (see infra/README.md).`);
  }
  return v;
};

// Whole stack lives in us-east-1: CloudFront requires its ACM certificate there,
// and a single-region stack avoids cross-region references.
new DocsStack(app, 'SceneryDocs', {
  env: { account: need('accountId'), region: 'us-east-1' },
  zoneId: need('hostedZoneId'),
  zoneName: app.node.tryGetContext('hostedZoneName') ?? 'scenery.dev',
  domainName: app.node.tryGetContext('domainName') ?? 'docs.scenery.dev',
  githubOidcSubject:
    app.node.tryGetContext('githubOidcSubject') ??
    'repo:scenery-dev@349575992/scenery-docs@1452127150:ref:refs/heads/main',
  createOidcProvider: String(app.node.tryGetContext('createOidcProvider')) === 'true',
  description: 'Hosting for the Scenery documentation site (S3, CloudFront, ACM, Route 53)',
});
