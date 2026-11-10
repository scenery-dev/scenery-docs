# Docs hosting (CDK)

Stack `SceneryDocs`: private S3 bucket (versioned, OAC), CloudFront with a viewer-request
rewrite function, ACM certificate (DNS-validated), Route 53 A/AAAA aliases, and a GitHub OIDC
deploy role limited (StringEquals, no wildcards) to GitHub's immutable OIDC subject for `main`
(see "GitHub OIDC subject" below).

The whole stack is in us-east-1 (CloudFront certificates must live there), so no cross-region references.

## Configuration (nothing identifying is committed)

Copy `cdk.context.example.json` to `cdk.context.json` (gitignored) and fill in real values, or pass `-c key=value`.

| key | meaning |
|-----|---------|
| `accountId` | AWS account id |
| `hostedZoneId` | Route 53 zone id for the parent zone |
| `hostedZoneName` | default `scenery.dev` |
| `domainName` | default `docs.scenery.dev` |
| `githubOidcSubject` | exact OIDC `sub` the deploy role trusts; default `repo:scenery-dev@349575992/scenery-docs@1452127150:ref:refs/heads/main` |
| `createOidcProvider` | `true` only if the account has no GitHub OIDC provider yet; default `false` imports `arn:aws:iam::<account>:oidc-provider/token.actions.githubusercontent.com` |

```
npm ci && npm test
npx cdk synth       # no AWS credentials needed
npx cdk diff && npx cdk deploy   # needs credentials and a bootstrapped us-east-1
```

Outputs `BucketName` and `DistributionId` (and `DeployRoleArn`) feed the deploy workflow.

## GitHub OIDC subject

This repo uses GitHub's immutable subject format, which embeds the numeric owner and repo IDs
(public GitHub metadata): `repo:<owner>@<owner-id>/<repo>@<repo-id>:ref:refs/heads/main`. A token
with the classic `repo:scenery-dev/scenery-docs:...` subject would not match, and only the immutable
form is trusted. To check or rebuild the prefix:

```
gh api repos/scenery-dev/scenery-docs/actions/oidc/customization/sub   # -> sub_claim_prefix
```

Append `:ref:refs/heads/main` to the `sub_claim_prefix` and pass it as `-c githubOidcSubject=...` if
it ever differs from the default (for example after a repo transfer or rename).

## Deploy-step notes

- Upload `.md` objects with `Content-Type: text/markdown; charset=utf-8` (S3 sync guesses wrong).
- Upload `.txt` as `text/plain; charset=utf-8`. Hashed `_astro/*` can be `immutable`; HTML `no-cache`.
- Invalidate `/*` after sync.
- The rewrite function maps `/path/` and `/path` to `/path/index.html`; URIs with an extension pass through.

## GitHub Actions configuration

`.github/workflows/deploy.yml` builds, guards and tests on every push and pull request, and deploys on push to `main` only. Set these in the repo settings (values below are placeholders; never commit real ones):

| name | kind | value |
|------|------|-------|
| `AWS_DEPLOY_ROLE_ARN` | variable | `DeployRoleArn` stack output, e.g. `arn:aws:iam::<account>:role/<name>` |
| `DOCS_BUCKET` | variable | `BucketName` stack output |
| `DOCS_DISTRIBUTION_ID` | variable | `DistributionId` stack output |
| `GUARD_PRIVATE_PATTERNS` | secret | newline-separated regexes; the job fails on `main` if empty |

Region is us-east-1. Upload runs three `s3 sync` passes (general, `.md`, `llms*.txt`) so content types are explicit; each pass uses `--delete` scoped to its own file class.
