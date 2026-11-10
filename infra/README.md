# Docs hosting (CDK)

Stack `SceneryDocs`: private S3 bucket (versioned, OAC), CloudFront with a viewer-request
rewrite function, ACM certificate (DNS-validated), Route 53 A/AAAA aliases, and a GitHub OIDC
deploy role limited to `repo:scenery-dev/scenery-docs:ref:refs/heads/main`.

The whole stack is in us-east-1 (CloudFront certificates must live there), so no cross-region references.

## Configuration (nothing identifying is committed)

Copy `cdk.context.example.json` to `cdk.context.json` (gitignored) and fill in real values, or pass `-c key=value`.

| key | meaning |
|-----|---------|
| `accountId` | AWS account id |
| `hostedZoneId` | Route 53 zone id for the parent zone |
| `hostedZoneName` | default `scenery.dev` |
| `domainName` | default `docs.scenery.dev` |
| `createOidcProvider` | `true` only if the account has no GitHub OIDC provider yet; default `false` imports `arn:aws:iam::<account>:oidc-provider/token.actions.githubusercontent.com` |

```
npm ci && npm test
npx cdk synth       # no AWS credentials needed
npx cdk diff && npx cdk deploy   # needs credentials and a bootstrapped us-east-1
```

Outputs `BucketName` and `DistributionId` (and `DeployRoleArn`) feed the deploy workflow.

## Deploy-step notes

- Upload `.md` objects with `Content-Type: text/markdown; charset=utf-8` (S3 sync guesses wrong).
- Upload `.txt` as `text/plain; charset=utf-8`. Hashed `_astro/*` can be `immutable`; HTML `no-cache`.
- Invalidate `/*` after sync.
- The rewrite function maps `/path/` and `/path` to `/path/index.html`; URIs with an extension pass through.
