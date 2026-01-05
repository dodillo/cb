# Release Guide

This guide covers the process for releasing new versions of Financial Performance Suite.

## Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features, backward compatible
- **PATCH**: Bug fixes, backward compatible

## Release Process

### 1. Preparation

Before creating a release, ensure:

- All tests pass
- Code is properly linted
- Dependencies are up to date
- Documentation is current
- Changelog is updated

### 2. Update Version

Update the version in `package.json`:

```json
{
  "name": "financial-performance-suite",
  "version": "1.1.0",
  ...
}
```

### 3. Update Changelog

Update `CHANGELOG.md` with the new version and changes:

```markdown
# Changelog

## [1.1.0] - 2025-11-02

### Added
- New budget analysis feature
- Enhanced reporting dashboard

### Fixed
- Fixed variance calculation bug
- Improved error handling

### Changed
- Updated dependencies
```

### 4. Create Release Branch

```bash
git checkout -b release/v1.1.0
git add .
git commit -m "Release v1.1.0"
git push origin release/v1.1.0
```

### 5. Create Pull Request

Create a PR from `release/v1.1.0` to `main` and get it approved.

### 6. Tag Release

After merging to main:

```bash
git checkout main
git pull origin main
git tag -a v1.1.0 -m "Release version 1.1.0"
git push origin v1.1.0
```

### 7. GitHub Release

Create a new release on GitHub:

1. Go to Releases
2. Click "Create a new release"
3. Tag: `v1.1.0`
4. Title: `Release v1.1.0`
5. Description: Copy from changelog
6. Publish release

### 8. Deploy to Production

The release will automatically deploy to production via CI/CD pipeline.

## Automated Release (Future)

We plan to implement automated releases using:

- GitHub Actions for CI/CD
- Semantic PR titles for automatic versioning
- Automated changelog generation

## Rollback Process

If a release needs to be rolled back:

1. Identify the problematic release
2. Create a hotfix branch from the previous stable tag
3. Fix the issue
4. Release a patch version
5. Update production deployment

## Pre-release Checklist

- [ ] All tests pass
- [ ] Code review completed
- [ ] Documentation updated
- [ ] Dependencies audited
- [ ] Performance tested
- [ ] Security scan passed
- [ ] Database migrations tested
- [ ] Environment variables documented
- [ ] Rollback plan prepared

## Post-release Tasks

- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Update staging environment
- [ ] Communicate changes to users
- [ ] Plan next release cycle
