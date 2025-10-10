# Contributing

When contributing to this repository, please first discuss the change you wish to make via issue,
email, or any other method with the owners of this repository before making a change.

Please note we have a [code of conduct](../.github/CODE_OF_CONDUCT.md), please follow it in all your interactions with the project.

## Feature Requests

We love feature requests! We want to make Freespeech as accessible to as many people as possible. If you have an
idea you'd like to see in Freespeech feel free to submit an issue following our [template format](ISSUE_TEMPLATE/feature_request.md). Or even a Pull Request implementing the
change! Although we won't be able to implement every feature everyone may make or want. We want to get as many as possible
that improves Freespeech.

## <a name="issue"></a> Found an Issue?

If you find a bug in the source code or any other issues you can help us by
submitting an issue to our [GitHub Repository](https://github.com/Merkie/freespeech/issues). Even better you can submit a Pull Request
with a fix.

### Submitting an Issue

Before you submit your issue search the archive, maybe your question was already answered.

If your issue appears to be a bug and hasn't been reported, open a new issue. Help us to maximize
the effort we can spend fixing issues and adding new features, by not reporting duplicate issues.
Following this [template](ISSUE_TEMPLATE/bug_report.md) will quicken the effort of fixing the issue.

## Installation and Setup

- [npm LTS](https://nodejs.org/en/)

#### Dev Setup

All commands are ran inside of a terminal inside of the vueapp folder

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production. Production ready code in /vueapp/dist

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Run unit tests

```
npm run test:unit
```

## Testing

Please keep unit testing in mind when contributing. Here is a great resource for this [Vue Test Utils](https://vue-test-utils.vuejs.org).

- Add tests for any new features
- If there is a bug create a test to see if it can be recreated and stop it from happening again.

We understand unit testing can be a tough concept at the start of a coding career. We do not want this to be a barrier to stop you from contributing. Please add unit tests if you have the knowledge. If not please reach out to us in the PR and we will help you or point you at examples or documentation to help you implement them.

## <a name="prProcess"></a> Pull Request Process

Before you submit your pull request consider the following guidelines:

- Search [GitHub](https://github.com/Merkie/freespeech/pulls) for an open or closed Pull Request
  that relates to your submission. You don't want to duplicate effort.
- [Fork](https://help.github.com/articles/fork-a-repo/) this repo.
- [Clone](https://help.github.com/articles/cloning-a-repository/) your copy.
  ```shell
  git clone https://github.com/YOUR_USERNAME/freespeech.git
  cd freespeech/
  ```
- After cloning, set a new remote [upstream](https://help.github.com/articles/configuring-a-remote-for-a-fork/) (this helps to keep your fork up to date)

  ```shell
  git remote add upstream https://github.com/Merkie/freespeech.git
  ```

- Make your changes in a new git branch:

  ```shell
  git checkout -b my-fix-branch master
  ```

- Commit your changes using a descriptive commit message.

  ```shell
  git commit -a
  ```

  Note: the optional commit `-a` command line option will automatically "add" and "rm" edited files.

- Make sure tests still pass with `npm run test:unit`. Fix any issues if test fail or change the test appropriately.
- Please add tests for new features you create. If not please state it in the PR. We can help you create them. But prefer for you to if you have the knowledge.

- Push your branch to GitHub:

  ```shell
  git push origin my-fix-branch
  ```

In GitHub, send a pull request to `freespeech:master`.
If we suggest changes, then:

- Make the required updates.
- Re-run tests and make sure they still pass.
- Commit your changes to your branch (e.g. `my-fix-branch`).
- Push the changes to your GitHub repository (this will update your Pull Request).

If the PR gets too outdated we may ask you to rebase and force push to update the PR:

```shell
git fetch upstream
git rebase upstream/master
git push origin my-fix-branch -f
```

That's it! Thank you for your contribution!

Most of is text is taken from the [RuneLite repo](https://github.com/runelite/runelite/blob/master/.github/CONTRIBUTING.md).
Thank you for the great template of a CONTRIBUTING guide and such great examples of git commands!
